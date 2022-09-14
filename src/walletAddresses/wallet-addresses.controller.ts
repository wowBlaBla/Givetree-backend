import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/database/entities/user.entity";
import { UpdateWalletAddressDto } from "./dto/update-wallet-address.dto";
import { WalletAddressesService } from "./wallet-addresses.service";

@Controller("wallet-addresses")
export class WalletAddressesController {
  constructor(
    private readonly walletAddressesService: WalletAddressesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.walletAddressesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.walletAddressesService.findOne({ id: +id });
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() updateWalletAddressDto: UpdateWalletAddressDto,
  ) {
    const walletAddress = await this.walletAddressesService.findOne({
      id: +id,
      relations: ["user"],
    });
    if (walletAddress.user.id !== user.id) {
      throw new UnauthorizedException(
        "You aren't the owner of this wallet address.",
      );
    }
    return this.walletAddressesService.update(+id, updateWalletAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    const walletAddress = await this.walletAddressesService.findOne({
      id: +id,
      relations: ["user"],
    });
    if (walletAddress.user.id !== user.id) {
      throw new UnauthorizedException(
        "You aren't the owner of this wallet address.",
      );
    }
    return this.walletAddressesService.remove(+id);
  }
}
