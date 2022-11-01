import { CreateDonationInput } from './create-donation.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDonationInput extends PartialType(CreateDonationInput) {
  @Field(() => Int)
  id: number;
}
