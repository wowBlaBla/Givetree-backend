import { Controller, Delete, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateNonceInput } from './dto/create-nonce.input';
import { ValidateSignInput } from './dto/validate-sign.input';
import { NoncesService } from './nonces.service';

@Controller('nonces')
export class NoncesController {

    constructor(
        private readonly nonceService: NoncesService
    ) {}

    @Post(':id')
    async create(
        @Param('id') id: string,
        @Body() createNonceInput: CreateNonceInput
    ) {
        return await this.nonceService.create(+id, createNonceInput);
    }

    @Post('/validate-signature/:id')
    async validateSignature(
        @Param('id') id: string,
        @Body() validateSignInput: ValidateSignInput
    ) {
        return await this.nonceService.validateSignature(+id, validateSignInput);
    }
    @Get()
    findAll() {
        return this.nonceService.findAll();
    }

    @Delete(':id')
    remove(
        @Param('id') id:string
    ) {
        return this.nonceService.remove(+id);
    }
}
