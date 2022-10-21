import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
    constructor(
        private readonly collectionsService: CollectionsService
    ) {}

    @Get()
    findAll() {
        return this.collectionsService.findAll();
    }

    @Post()
    create(
        @Body() createCollection: CreateCollectionDto
    ) {
        return this.collectionsService.create(createCollection);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param(':id') id: string,
        @Body() updateCollection: UpdateCollectionDto
    ) {
        return this.collectionsService.update(+id, updateCollection);
    }

}
