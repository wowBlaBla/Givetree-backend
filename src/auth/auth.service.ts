import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  ConflictException,
  HttpService,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { TokenExpiredError } from "jsonwebtoken";
import { User } from "../database/entities/user.entity";
import { UsersService } from "../users/users.service";
import { RefreshToken } from "../database/entities/refresh-token.entity";
import { Nonce } from "../database/entities/nonce.entity";
import { WalletAddressesService } from "src/walletAddresses/wallet-addresses.service";
import { generate as generateRandom } from "randomstring";
import { MailService } from "src/services/mail.service";
import { EtherUtilService } from "src/services/ether-util.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private walletAddressesService: WalletAddressesService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: EntityRepository<RefreshToken>,
    @InjectRepository(Nonce)
    private nonceRepository: EntityRepository<Nonce>,
    private httpService: HttpService,
    private mailService: MailService,
    private etherUtilService: EtherUtilService,
  ) {}

  async validateUserWithEmail(emailOrUsername: string, pass: string) {
    try {
      const user = await this.usersService.findOneEither({
        email: emailOrUsername,
        userName: emailOrUsername,
        relations: ["charityProperty", "walletAddresses", "socials"],
      });

      if (!user) {
        throw new NotFoundException("User doens't exists");
      }

      const { password } = user;

      const match = await bcrypt.compare(pass, password);
      if (match) {
        return user;
      } else {
        throw new BadRequestException("Password is incorrect");
      }
    } catch (err) {
      throw err;
    }
  }

  async validateUserWithWallet(address: string, network: string, type: string) {
    try {
      const user = await this.usersService.findOne({
        walletAddress: { address, network, type },
      });

      if (!user) {
        throw new NotFoundException("User doens't exists");
      }

      return user;
    } catch (err) {
      throw err;
    }
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

  async registerWithEmail(email: string, userName: string, password: string) {
    try {
      let user = await this.usersService.findOneEither({
        email: email,
        userName: userName,
        relations: ["charityProperty", "walletAddresses", "socials"],
      });

      if (user) {
        throw new ConflictException("User already exists");
      }

      const verifyToken = generateRandom({
        length: 48,
        charset: "alphanumeric",
        capitalization: "lowercase",
      });

      const hashed = await bcrypt.hash(password, 10);
      user = await this.usersService.create({
        email,
        userName,
        password: hashed,
        verifyToken,
      });

      this.mailService.sendVerificationEmail(
        "localhost:3000",
        email,
        verifyToken,
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async registerWithWallet(
    address: string,
    network: string,
    signature: string,
  ) {
    try {
      let user = await this.usersService.findOne({
        walletAddress: { address, network },
      });

      if (user) {
        throw new ConflictException("User already exists");
      }

      const nonce = await this.nonceRepository.findOne({
        publicAddress: address,
      });

      if (!nonce) {
        throw new NotAcceptableException("Nonce was expired");
      }

      const verifiedAddress = this.etherUtilService.recoverPersonalSignature(
        nonce.nonce,
        signature,
      );

      if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
        throw new NotAcceptableException("Invalid signature");
      }

      const userName = generateRandom({
        length: 7,
        charset: "alphanumeric",
        readable: true,
        capitalization: "lowercase",
      });

      user = await this.usersService.create({
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
    } catch (err) {
      throw err;
    }
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

  async generateNonce(address: string) {
    try {
      const oneTime = this.etherUtilService.generateNonce();

      let nonce = await this.nonceRepository.findOne({
        publicAddress: address,
      });
      if (!nonce) {
        nonce = this.nonceRepository.create({
          publicAddress: address,
          nonce: oneTime,
        });
        await this.nonceRepository.persistAndFlush(nonce);
      } else {
        nonce = this.nonceRepository.assign(nonce, { nonce: oneTime });
        await this.nonceRepository.flush();
      }

      return nonce;
    } catch (err) {
      throw err;
    }
  }

  async verifyEmail(token: string) {
    return this.usersService.setEmailVerify(token);
  }
}
