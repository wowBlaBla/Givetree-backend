import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from "@nestjs/graphql";
import { CreateWalletAddressInput } from "./create-wallet-address.input";
import { WalletAddressObject } from "./wallet-address.object";

@InputType()
export class UpdateWalletAddressInput extends IntersectionType(
  PickType(WalletAddressObject, ["id"] as const, InputType),
  PartialType(CreateWalletAddressInput),
) {}
