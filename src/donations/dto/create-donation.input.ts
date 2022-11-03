import { InputType, OmitType } from '@nestjs/graphql';
import { DonationsObject } from './donations.object';

@InputType()
export class CreateDonationInput extends OmitType(
  DonationsObject,
  ["id", "createdAt", "updatedAt"] as const,
  InputType
) { }