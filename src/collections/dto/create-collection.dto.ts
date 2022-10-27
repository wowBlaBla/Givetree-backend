import { ApiProperty } from "@nestjs/swagger";

export class CreateCollectionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    pattern: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    network: string;

    @ApiProperty()
    logo: string;

    @ApiProperty()
    featured: string;

    @ApiProperty()
    banner: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}