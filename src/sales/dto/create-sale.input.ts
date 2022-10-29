import { InputType, OmitType } from '@nestjs/graphql';
import { SalesObject } from './sales.object';

@InputType()
export class CreateSaleInput extends OmitType (
  SalesObject,
  ['id', 'createdAt', 'updatedAt'] as const,
  InputType
) { }
