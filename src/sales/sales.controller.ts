import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleInput } from './dto/create-sale.input';
import { SalesService } from './sales.service';

export interface Where {
    network: string;
    collection: string;
    tokenId: string;
    seller: string;
}

@Controller('sales')
export class SalesController {
    constructor(
        private readonly salesService: SalesService
    ) { }
    
    @Post()
    create(
        @Body() createSalesInput: CreateSaleDto | CreateSaleInput
    ) {
        return this.salesService.create(createSalesInput);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Get('/seller')
    find(
        @Query('seller') seller: string
    ) {
        return this.salesService.find(seller);
    }
    @Delete()
    remove(
        @Body() where: Where
    ) {
        return this.salesService.remove(where);
    }
}
