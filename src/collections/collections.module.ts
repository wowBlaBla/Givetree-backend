import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collections } from 'src/database/entities/collections.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  controllers: [CollectionsController],
  imports: [
    MikroOrmModule.forFeature([Collections]),
  ],
  providers: [CollectionsService, /*SocialsResolver*/],
  exports: [CollectionsService],
})
export class CollectionsModule {}