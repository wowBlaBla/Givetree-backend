import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  HttpService,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../database/entities/user.entity";
import { UsersService } from "../users/users.service";
import { RefreshToken } from "../database/entities/refresh-token.entity";
import { WalletAddressesService } from "src/walletAddresses/wallet-addresses.service";
import { generate as generateRandomString } from "randomstring";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private walletAddressesService: WalletAddressesService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    private httpService: HttpService,
  ) {}

  async validateUserWithEmail(email: string, pass: string) {
    let user = await this.usersService.findOne({
      email,
      relations: ["charityProperty", "walletAddresses", "socials"],
    });

    if (!user) {
      user = await this.usersService.findOne({
        userName: email,
      });
    }

    if (!user) {
      return null;
    }

    const { password } = user;

    const match = await bcrypt.compare(pass, password);
    if (match) {
      return user;
    } else {
      return null;
    }
  }

  async validateUserWithWallet(address: string, network: string) {
    const user = await this.usersService.findOne({
      walletAddress: { address, network, type: "auth" },
      relations: ["charityProperty", "walletAddresses", "socials"],
    });
    if (user) {
      return user;
    }
    return null;
  }

  async generateAccessToken(user: Pick<User, "id">) {
    const payload = { sub: String(user.id) };
    return await this.jwtService.signAsync(payload);
  }

  async createRefreshToken(user: Pick<User, "id">, ttl: number) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl * 1000);

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
      expiresIn: 60 * 60 * 24 * 30,
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

      if (+token.revoked) {
        throw new UnprocessableEntityException("Refresh token revoked");
      }

      const user = await this.usersService.findOne({
        id: token.user.id,
        relations: ["charityProperty", "walletAddresses", "socials"],
      });

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

  async registerWithEmail(email: string, userName: string, pass: string) {
    let user = await this.usersService.findOne({ email });
    if (user) {
      return null;
    }

    user = await this.usersService.findOne({ userName });
    if (user) {
      return null;
    }

    const hashed = await bcrypt.hash(pass, 10);
    user = await this.usersService.create({
      email,
      userName,
      password: hashed,
    });

    return user;
  }

  async registerWithWallet(address: string, network: string) {
    const walletAddress = await this.usersService.findOne({
      walletAddress: { address, type: "auth", network },
    });
    if (walletAddress) {
      return null;
    }

    const userName = generateRandomString({
      length: 7,
      charset: "alphanumeric",
      readable: true,
      capitalization: "lowercase",
    });

    const user = await this.usersService.create({
      email: null,
      userName,
      password: null,
    });
    await this.walletAddressesService.create(user.id, {
      address,
      type: "auth",
      network,
    });

    return user;
  }

  async validateRecaptcha(token: string) {
    const requestBody = new URLSearchParams({
      secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: token,
    });

    const res = await this.httpService.axiosRef.post(
      "https://www.google.com/recaptcha/api/siteverify",
      requestBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return res.data;
  }
}
