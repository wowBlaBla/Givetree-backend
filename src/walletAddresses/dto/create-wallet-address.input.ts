import { InputType, OmitType } from "@nestjs/graphql";
import { WalletAddressObject } from "./wallet-address.object";

@InputType()
export class CreateWalletAddressInput extends OmitType(
  WalletAddressObject,
  ["id", "createdAt", "updatedAt"] as const,
  InputType,
) {}
