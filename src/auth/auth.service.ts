import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../database/entities/user.entity";
import { UsersService } from "../users/users.service";
import { RefreshToken } from "../database/entities/refresh-token.entity";
import { WalletAddressesService } from "src/walletAddresses/wallet-addresses.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private walletAddressesService: WalletAddressesService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOne({ email });
    if (user) {
      const { password, ...result } = user;
      const match = await bcrypt.compare(pass, password);
      if (match) {
        return result;
      }
    }
    return null;
  }

  async generateAccessToken(user: Pick<User, "id">) {
    const payload = { sub: String(user.id) };
    return await this.jwtService.signAsync(payload);
  }

  async createRefreshToken(user: Pick<User, "id">, ttl: number) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    const token = this.refreshTokenRepository.create({
      user,
      expires: expiration,
    });

    await this.refreshTokenRepository.persistAndFlush(token);

    return token;
  }

  async generateRefreshToken(user: Pick<User, "id">, expiresIn: number) {
    const payload = { sub: String(user.id) };
    const token = await this.createRefreshToken(user, expiresIn);
    return await this.jwtService.signAsync({
      ...payload,
      expiresIn,
      jwtId: String(token.id),
    });
  }

  async resolveRefreshToken(encoded: string) {
    try {
      const payload = await this.jwtService.verify(encoded);

      if (!payload.sub || !payload.jwtId) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      const token = await this.refreshTokenRepository.findOne({
        id: payload.jwtId,
      });

      if (!token) {
        throw new UnprocessableEntityException("Refresh token not found");
      }

      if (token.revoked) {
        throw new UnprocessableEntityException("Refresh token revoked");
      }

      const user = await this.usersService.findOne({ id: payload.subject });

      if (!user) {
        throw new UnprocessableEntityException("Refresh token malformed");
      }

      return { user, token };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException("Refresh token expired");
      } else {
        throw new UnprocessableEntityException("Refresh token malformed");
      }
    }
  }

  async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  async register(email?: string, pass?: string, address?: string) {
    let user: User = null;
    if (email && pass) {
      user = await this.usersService.findOne({ email });
      if (user) {
        return null;
      }

      const hashed = await bcrypt.hash(pass, 10);
      user = await this.usersService.create({ email, password: hashed });
    } else if (address) {
      // const walletAddress = await this.walletAddressesService.findOneByAddress({
      //   address,
      // });
      // if (walletAddress) {
      return null;
      // }

      // user = await this.usersService.create({ email: null, password: null });
      // await this.walletAddressesService.create(user.id, { address });
    } else {
      throw new Error("Email, password or Address must be provided");
    }

    return user;
  }
}
