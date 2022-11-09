import { InputType, OmitType } from '@nestjs/graphql';
import { NonceObject } from './nonces.object';

@InputType()
export class CreateNonceInput extends OmitType (
  NonceObject,
  ['id', 'createdAt', 'updatedAt'] as const,
  InputType
) { }