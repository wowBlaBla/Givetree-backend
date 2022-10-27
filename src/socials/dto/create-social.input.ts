import { InputType, OmitType } from '@nestjs/graphql';
import { SocialsObject } from './socials.object';

@InputType()
export class CreateSocialInput extends OmitType(
  SocialsObject,
  ['id', 'createdAt', 'updatedAt'] as const,
  InputType
) {}