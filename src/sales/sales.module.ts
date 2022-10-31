import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Sales } from 'src/database/entities/sales.entity';

@Module({
  controllers: [SalesController],
  imports: [
    MikroOrmModule.forFeature([Sales]),
  ],
  providers: [SalesService, /*SalesResolver*/],
  exports: [SalesService],
})
export class SalesModule {}
