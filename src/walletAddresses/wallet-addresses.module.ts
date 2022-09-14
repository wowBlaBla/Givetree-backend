import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { WalletAddress } from "../database/entities/wallet-address.entity";
import { WalletAddressesController } from "./wallet-addresses.controller";
import { WalletAddressesResolver } from "./wallet-addresses.resolver";
import { WalletAddressesService } from "./wallet-addresses.service";

@Module({
  controllers: [WalletAddressesController],
  imports: [
    MikroOrmModule.forFeature([WalletAddress]),
    forwardRef(() => UsersModule),
  ],
  providers: [WalletAddressesService, WalletAddressesResolver],
  exports: [WalletAddressesService],
})
export class WalletAddressesModule {}
