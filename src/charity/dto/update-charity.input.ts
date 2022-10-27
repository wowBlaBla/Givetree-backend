import { CreateCharityInput } from './create-charity.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCharityInput extends PartialType(CreateCharityInput) {
  @Field(() => Int)
  id: number;
}
