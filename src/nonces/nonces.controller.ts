import { Controller, Delete, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { CreateNonceInput } from './dto/create-nonce.input';
import { ValidateSignInput } from './dto/validate-sign.input';
import { NoncesService } from './nonces.service';

@Controller('nonces')
export class NoncesController {

    constructor(
        private readonly nonceService: NoncesService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @CurrentUser() user: User,
        @Body() createNonceInput: CreateNonceInput
    ) {
        return await this.nonceService.create(+user.id, createNonceInput);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/validate-signature')
    async validateSignature(
        @CurrentUser() user: User,
        @Body() validateSignInput: ValidateSignInput
    ) {
        return await this.nonceService.validateSignature(+user.id, validateSignInput);
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
