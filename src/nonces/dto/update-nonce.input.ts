import { CreateNonceInput } from './create-nonce.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNonceInput extends PartialType(CreateNonceInput) {
  @Field(() => Int)
  id: number;
}
