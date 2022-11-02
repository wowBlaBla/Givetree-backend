import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";
import { AuthService } from "./auth.service";
import {
  LoginUserWithEmailInput,
  LoginUserWithWalletInput,
} from "./dto/login-user.input";
import { LoginUserPayload } from "./dto/login-user.payload";
import { RefreshTokenInput } from "./dto/refresh-token.input";
import { RefreshTokenPayload } from "./dto/refresh-token.payload";
import {
  RegisterUserWithEmailInput,
  RegisterUserWithWalletInput,
} from "./dto/register-user.input";
import { RegisterUserPayload } from "./dto/register-user.payload";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserPayload)
  async loginEmail(@Args("input") input: LoginUserWithEmailInput) {
    const user = await this.authService.validateUserWithEmail(
      input.email,
      input.password,
    );

    if (!user) {
      return new UserInputError("Email or password incorrect.");
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserPayload();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Mutation(() => LoginUserPayload)
  async loginWallet(@Args("input") input: LoginUserWithWalletInput) {
    const user = await this.authService.validateUserWithWallet(
      input.address,
      input.network,
    );

    if (!user) {
      return new UserInputError("Wallet address incorrect.");
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserPayload();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Mutation(() => RefreshTokenPayload)
  async refreshToken(@Args("input") input: RefreshTokenInput) {
    const { user, token } =
      await this.authService.createAccessTokenFromRefreshToken(
        input.refreshToken,
      );

    const payload = new RefreshTokenPayload();
    payload.user = user;
    payload.accessToken = token;

    return payload;
  }

  @Mutation(() => RegisterUserPayload)
  async registerEmail(@Args("input") input: RegisterUserWithEmailInput) {
    const user = await this.authService.registerWithEmail(
      input.email,
      input.userName,
      input.password,
    );

    if (!user) {
      return new UserInputError(`User by email ${input.email} already exists.`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new RegisterUserPayload();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Mutation(() => RegisterUserPayload)
  async registerWallet(@Args("input") input: RegisterUserWithWalletInput) {
    const user = await this.authService.registerWithWallet(
      input.address,
      input.userName,
      input.network,
    );

    if (!user) {
      return new UserInputError(
        `User by wallet address ${input.address} already exists.`,
      );
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new RegisterUserPayload();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }
}
