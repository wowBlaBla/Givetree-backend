import { InputType, OmitType } from '@nestjs/graphql';
import { CharityObject } from './charity.object';

@InputType()
export class CreateCharityInput extends OmitType(
  CharityObject,
  ['id', 'createdAt', 'updatedAt'] as const,
  InputType
) { }