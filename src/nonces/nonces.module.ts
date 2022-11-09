import { forwardRef, Module } from '@nestjs/common';
import { NoncesService } from './nonces.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Nonces } from 'src/database/entities/nonces.entity';
import { UsersModule } from 'src/users/users.module';
import { NoncesController } from './nonces.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Nonces]), UsersModule],
  providers: [NoncesService],
  controllers: [NoncesController],
})
export class NoncesModule {}
