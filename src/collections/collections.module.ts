import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collections } from 'src/database/entities/collections.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [CollectionsController],
  imports: [
    MikroOrmModule.forFeature([Collections]),
  ],
  providers: [CollectionsService, S3Service],
  exports: [CollectionsService],
})
export class CollectionsModule {}