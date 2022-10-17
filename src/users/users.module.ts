import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { PostsModule } from "../posts/posts.module";
import { WalletAddressesModule } from "../walletAddresses/wallet-addresses.module";
import { User } from "../database/entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { S3Service } from "src/services/s3.service";
import { CharityModule } from "src/charity/charity.module";

@Module({
  imports: [
    forwardRef(() => PostsModule),
    forwardRef(() => WalletAddressesModule),
    CharityModule,
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService, S3Service],
  exports: [UsersService],
})
export class UsersModule {}
