import { PartialType } from "@nestjs/swagger";
import { CreateCharityDto } from "./create-charity.dto";

export class UpdateCharityDto extends PartialType(CreateCharityDto) {}