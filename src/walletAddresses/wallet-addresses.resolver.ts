import { Selections } from "@jenyus-org/nestjs-graphql-utils";
import { UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UsersService } from "src/users/users.service";
import { GqlCurrentUser } from "../auth/decorator/gql-current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UserObject } from "../users/dto/user.object";
import { User } from "../database/entities/user.entity";
import { WalletAddressObject } from "./dto/wallet-address.object";
import { UpdateWalletAddressInput } from "./dto/update-wallet-address.input";
import { WalletAddress } from "../database/entities/wallet-address.entity";
import { WalletAddressesService } from "./wallet-addresses.service";

@Resolver(() => WalletAddressObject)
export class WalletAddressesResolver {
  constructor(
    private readonly walletAddressesService: WalletAddressesService,
    private usersService: UsersService,
  ) {}

  @Query(() => [WalletAddressObject])
  walletAddresses(
    @Selections("walletAddresses", ["user"]) relations: string[],
  ) {
    return this.walletAddressesService.findAll({ relations });
  }

  @Query(() => WalletAddressObject)
  walletAddress(
    @Selections("walletAddress", ["user"]) relations: string[],
    @Args("id", { type: () => Int }) id: number,
  ) {
    return this.walletAddressesService.findOne({ id, relations });
  }

  @Mutation(() => WalletAddressObject)
  @UseGuards(GqlAuthGuard)
  async updateWalletAddress(
    @GqlCurrentUser() user: User,
    @Args("input") input: UpdateWalletAddressInput,
  ) {
    const walletAddress = await this.walletAddressesService.findOne({
      id: input.id,
      relations: ["user"],
    });
    if (walletAddress.user.id !== user.id) {
      throw new UnauthorizedException(
        "You aren't the owner of this wallet address.",
      );
    }
    return this.walletAddressesService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteWalletAddress(
    @GqlCurrentUser() user: User,
    @Args("id", { type: () => Int }) id: number,
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
    return this.walletAddressesService.remove(id);
  }

  @ResolveField(() => UserObject)
  async user(@Parent() walletAddress: WalletAddress) {
    if (walletAddress.user) {
      return walletAddress.user;
    }
    return await this.usersService.findOne({
      walletAddress: walletAddress.address,
    });
  }
}
