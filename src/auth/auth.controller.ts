import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { UserDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { LoginUserWithEmailBody } from "./dto/login-user.body";
import { LoginUserResponse } from "./dto/login-user.response";
import { RefreshTokenBody } from "./dto/refresh-token.body";
import { RefreshTokenResponse } from "./dto/refresh-token.response";
import {
  RegisterUserWithEmailBody,
  RegisterUserWithWalletBody,
} from "./dto/register-user.body";
import { RegisterUserResponse } from "./dto/register-user.response";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login-email")
  @ApiBody({ type: LoginUserWithEmailBody })
  @ApiOkResponse({
    description: "User has been logged in.",
    type: LoginUserResponse,
  })
  async loginEmail(@Request() req) {
    const accessToken = await this.authService.generateAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(
      req.user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserResponse();
    payload.user = new UserDto(req.user);
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
    const {
      user,
      token,
    } = await this.authService.createAccessTokenFromRefreshToken(
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
    const user = await this.authService.registerWithEmail(
      registerInput.email,
      registerInput.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        `User by email ${registerInput.email} already exists.`,
      );
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
    const user = await this.authService.registerWithWallet(
      registerInput.address,
    );

    if (!user) {
      throw new UnauthorizedException(
        `User by wallet address ${registerInput.address} already exists.`,
      );
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
}
