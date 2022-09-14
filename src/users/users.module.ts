import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { PostsModule } from "../posts/posts.module";
import { WalletAddressesModule } from "../walletAddresses/wallet-addresses.module";
import { User } from "../database/entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    forwardRef(() => PostsModule),
    forwardRef(() => WalletAddressesModule),
  ],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
