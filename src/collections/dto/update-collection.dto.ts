import { PartialType } from "@nestjs/swagger";
import { Socials } from "src/database/entities/socials.entity";
import { CreateCollectionDto } from "./create-collection.dto";

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
    socials?: Socials[]
}