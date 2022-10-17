import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from 'src/users/users.module';
import { CharityController } from './charity.controller';
import { CharityProperty } from 'src/database/entities/charity-property.entity';
import { CharityService } from './charity.service';

@Module({
  controllers: [CharityController],
  imports: [
    MikroOrmModule.forFeature([CharityProperty]),
    forwardRef(() => UsersModule),
  ],
  providers: [CharityService, /*CharityResolver*/],
  exports: [CharityService],
})
export class CharityModule {}
