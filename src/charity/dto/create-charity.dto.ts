import { ApiProperty } from "@nestjs/swagger";

export class CreateCharityDto {
    
    @ApiProperty()
    founded_at?: Date;

    @ApiProperty()
    employee?: Number;

    @ApiProperty()
    founders?: string;

    @ApiProperty()
    phone?: string;
}