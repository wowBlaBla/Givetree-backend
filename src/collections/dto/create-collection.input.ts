import { InputType, OmitType } from '@nestjs/graphql';
import { CollectionObject } from './collection.object';

@InputType()
export class CreateCollectionInput extends OmitType(
  CollectionObject,
  ["id", "createdAt", "updatedAt"] as const,
  InputType,
) {}