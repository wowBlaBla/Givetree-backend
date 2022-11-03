import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Donations } from "src/database/entities/donations.entity";
import { DonationsController } from "./donations.controller";
import { DonationsService } from "./donations.service";

@Module({
  controllers: [DonationsController],
  imports: [
    MikroOrmModule.forFeature([Donations]),
  ],
  providers: [DonationsService, /*DonationsResolver*/],
  exports: [DonationsService],
})
export class DonationsModule {}
