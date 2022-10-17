import { forwardRef, Module } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsController } from './socials.controller';
import { Socials } from 'src/database/entities/socials.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SocialsController],
  imports: [
    MikroOrmModule.forFeature([Socials]),
    forwardRef(() => UsersModule),
  ],
  providers: [SocialsService, /*SocialsResolver*/],
  exports: [SocialsService],
})
export class SocialsModule {}
