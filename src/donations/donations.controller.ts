import { Body, Controller, Delete, Get, Post, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { DonationsService } from './donations.service';
import { CreateDonationInput } from './dto/create-donation.input';

@Controller('donations')
export class DonationsController {
    constructor(
        private readonly donationService: DonationsService
    ) { }
    
    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @CurrentUser() user: User,
        @Body() createSalesInput: CreateDonationInput
    ) {
        return this.donationService.create({...createSalesInput, from: user.id.toString()});
    }

    @Get()
    findAll() {
        return this.donationService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post(':target')
    find(
        @CurrentUser() user: User,
        @Param('target') target:string
    ) {
        try {
            if (target == 'from' || target == 'to') {
                return this.donationService.find({ [target]: user.id });
            }
            return [];
        } catch(err) {

        }
    }

}
