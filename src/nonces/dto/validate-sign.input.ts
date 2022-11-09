import { InputType, OmitType } from "@nestjs/graphql";
import { NonceObject } from "./nonces.object";

@InputType()
export class ValidateSignInput extends OmitType(
    NonceObject,
    ['id', 'updatedAt', 'createdAt'] as const,
    InputType
) { }