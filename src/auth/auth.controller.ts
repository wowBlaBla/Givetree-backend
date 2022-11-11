import {
  Body,
  Controller,
  Post,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { Nonce } from "src/database/entities/nonce.entity";
import { UserDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { CheckWalletBody } from "./dto/check-wallet.body";
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
import { ResetPasswordBody } from "./dto/reset-password.body";
import { ValidateRecaptchaBody } from "./dto/validate-recaptcha.body";
import { ValidateRecaptchaResponse } from "./dto/validate-recaptcha.response";
import { VerifyEmailBody } from "./dto/verify-email.body";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login-email")
  @ApiOkResponse({
    description: "User has been logged in.",
    type: LoginUserResponse,
  })
  async loginEmail(@Body() loginInput: LoginUserWithEmailBody) {
    try {
      if (!loginInput.email || !loginInput.password) {
        throw new BadRequestException(
          "Username(email) and password shouldn't be empty",
        );
      }

      const user = await this.authService.validateUserWithEmail(
        loginInput.email,
        loginInput.password,
      );

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
    } catch (err) {
      throw err;
    }
  }

  @Post("login-wallet")
  @ApiOkResponse({
    description: "User has been logged in.",
    type: LoginUserResponse,
  })
  async loginWallet(@Body() loginInput: LoginUserWithWalletBody) {
    try {
      if (!loginInput.address || !loginInput.network) {
        throw new BadRequestException("Wallet address shouldn't be empty");
      }

      const user = await this.authService.validateUserWithWallet(
        loginInput.address,
        loginInput.network,
        "auth",
      );

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
    } catch (err) {
      throw err;
    }
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
    try {
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
    } catch (err) {
      throw err;
    }
  }

  @Post("register-wallet")
  @ApiCreatedResponse({
    description: "User has been registered.",
    type: RegisterUserResponse,
  })
  async registerWithWallet(@Body() registerInput: RegisterUserWithWalletBody) {
    try {
      if (!registerInput.address || !registerInput.network) {
        throw new BadRequestException("Wallet address shouldn't be empty");
      }

      const user = await this.authService.registerWithWallet(
        registerInput.address,
        registerInput.network,
        registerInput.signature,
      );

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
    } catch (err) {
      throw err;
    }
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

  @Post("request-sign-transaction")
  @ApiCreatedResponse({
    description: "Returend token is correct",
    type: Nonce,
  })
  async requestSignTransaction(@Body() checkWalletInput: CheckWalletBody) {
    try {
      const res = await this.authService.generateNonce(
        checkWalletInput.address,
      );

      return res;
    } catch (err) {
      throw err;
    }
  }

  // @Post("request-verify-email")
  // @ApiCreatedResponse({
  //   description: "Email successfully sent.",
  //   type: Boolean,
  // })
  // async requestVerifyEmail(@Body() resetPasswordInput: LoginUserWithEmailBody) {
  //   try {
  //     if (!resetPasswordInput.email) {
  //       throw new BadRequestException("Email must be provided");
  //     }

  //     const res = await this.authService.requestResetPassword(
  //       resetPasswordInput.email,
  //     );

  //     return res;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  @Post("verify-email")
  @ApiCreatedResponse({
    description: "Verified email successfully",
    type: RegisterUserResponse,
  })
  async verifyEmail(@Body() validateRecaptchaInput: VerifyEmailBody) {
    try {
      const user = await this.authService.verifyEmail(
        validateRecaptchaInput.token,
      );

      if (user) {
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
      } else {
        throw new NotFoundException("User doens't exists");
      }
    } catch (err) {
      throw err;
    }
  }

  @Post("request-reset-password")
  @ApiCreatedResponse({
    description: "Email successfully sent.",
    type: Boolean,
  })
  async requestResetPassword(
    @Body() resetPasswordInput: LoginUserWithEmailBody,
  ) {
    try {
      if (!resetPasswordInput.email) {
        throw new BadRequestException("Email must be provided");
      }

      const res = await this.authService.requestResetPassword(
        resetPasswordInput.email,
      );

      return res;
    } catch (err) {
      throw err;
    }
  }

  @Post("reset-password")
  @ApiCreatedResponse({
    description: "Password successfully changed",
    type: Boolean,
  })
  async resetPassword(@Body() resetPasswordBody: ResetPasswordBody) {
    try {
      const ret = await this.authService.resetPassword(
        resetPasswordBody.token,
        resetPasswordBody.password,
      );
      return ret;
    } catch (err) {
      throw err;
    }
  }
}
