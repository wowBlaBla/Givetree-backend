import { ApiProperty } from "@nestjs/swagger";

export class CreateSaleDto {
    
    @ApiProperty({ required: true })
    readonly collection: string;

    @ApiProperty({ required: true })
    readonly tokenId: string;

    @ApiProperty({ required: true })
    readonly seller: string;
}