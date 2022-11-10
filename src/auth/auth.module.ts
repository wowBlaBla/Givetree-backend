import { MikroOrmModule } from "@mikro-orm/nestjs";
import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { WalletAddressesModule } from "src/walletAddresses/wallet-addresses.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { RefreshToken } from "../database/entities/refresh-token.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { MailService } from "src/services/mail.service";
import { EtherUtilService } from "src/services/ether-util.service";
import { Nonce } from "src/database/entities/nonce.entity";

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("auth.jwtKey"),
        signOptions: { expiresIn: "15m" },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WalletAddressesModule,
    HttpModule,
    MikroOrmModule.forFeature([RefreshToken]),
    MikroOrmModule.forFeature([Nonce]),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    MailService,
    EtherUtilService,
  ],
})
export class AuthModule {}
