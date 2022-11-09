import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { UserDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import {
  LoginUserWithEmailBody,
  LoginUserWithWalletBody,
} from "./dto/login-user.body";
import { LoginUserResponse } from "./dto/login-user.response";
import { RefreshTokenBody } from "./dto/refresh-token.body";
import { RefreshTokenResponse } from "./dto/refresh-token.response";
import {
  RegisterUserWithEmailBody,
  RegisterUserWithWalletBody,
} from "./dto/register-user.body";
import { RegisterUserResponse } from "./dto/register-user.response";
import { ValidateRecaptchaBody } from "./dto/validate-recaptcha.body";
import { ValidateRecaptchaResponse } from "./dto/validate-recaptcha.response";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login-email")
  @ApiOkResponse({
    description: "User has been logged in.",
    type: LoginUserResponse,
  })
  async loginEmail(@Body() loginInput: LoginUserWithEmailBody) {
    if (!loginInput.email || !loginInput.password) {
      throw new BadRequestException(
        "Username(email) and password shouldn't be empty",
      );
    }

    const user = await this.authService.validateUserWithEmail(
      loginInput.email,
      loginInput.password,
    );
    if (!user) {
      throw new UnauthorizedException(
        "Email or username or password is incorrect",
      );
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserResponse();
    payload.user = new UserDto(user);
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;
    return payload;
  }

  @Post("login-wallet")
  @ApiOkResponse({
    description: "User has been logged in.",
    type: LoginUserResponse,
  })
  async loginWallet(@Body() loginInput: LoginUserWithWalletBody) {
    if (!loginInput.address || !loginInput.network) {
      throw new BadRequestException("Wallet address shouldn't be empty");
    }

    const user = await this.authService.validateUserWithWallet(
      loginInput.address,
      loginInput.network,
    );

    if (!user) {
      throw new UnauthorizedException(`User doesn't exist.`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserResponse();
    payload.user = new UserDto(user);
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Post("refresh")
  @ApiOkResponse({
    description: "Generates a new access token.",
    type: RefreshTokenResponse,
  })
  async refresh(@Body() refreshInput: RefreshTokenBody) {
    const { user, token } =
      await this.authService.createAccessTokenFromRefreshToken(
        refreshInput.refreshToken,
      );

    const payload = new RefreshTokenResponse();
    payload.user = new UserDto(user);
    payload.accessToken = token;
    return payload;
  }

  @Post("register-email")
  @ApiCreatedResponse({
    description: "User has been registered.",
    type: RegisterUserResponse,
  })
  async registerWithEmail(@Body() registerInput: RegisterUserWithEmailBody) {
    if (
      !registerInput.username ||
      !registerInput.email ||
      !registerInput.password
    ) {
      throw new BadRequestException(
        "Username, email and password shouldn't be empty",
      );
    }

    const user = await this.authService.registerWithEmail(
      registerInput.email,
      registerInput.username,
      registerInput.password,
    );

    if (!user) {
      throw new UnauthorizedException(`User already exists.`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new RegisterUserResponse();
    payload.user = new UserDto(user);
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Post("register-wallet")
  @ApiCreatedResponse({
    description: "User has been registered.",
    type: RegisterUserResponse,
  })
  async registerWithWallet(@Body() registerInput: RegisterUserWithWalletBody) {
    if (!registerInput.address || !registerInput.network) {
      throw new BadRequestException("Wallet address shouldn't be empty");
    }

    const user = await this.authService.registerWithWallet(
      registerInput.address,
      registerInput.network,
    );

    if (!user) {
      throw new UnauthorizedException(`User already exists.`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    const payload = new RegisterUserResponse();
    payload.user = new UserDto(user);
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Post("validate-recaptcha")
  @ApiCreatedResponse({
    description: "Returend token is correct",
    type: ValidateRecaptchaResponse,
  })
  async validateRecaptcha(
    @Body() validateRecaptchaInput: ValidateRecaptchaBody,
  ) {
    const res = await this.authService.validateRecaptcha(
      validateRecaptchaInput.token,
    );

    const payload = new ValidateRecaptchaResponse();
    payload.success = res.success;
    payload.challengeTs = res.challenge_ts;
    payload.hostname = res.hostname;
    payload.errorCodes = res["error-codes"];

    return payload;
  }
}
