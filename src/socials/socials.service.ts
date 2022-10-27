import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Socials } from 'src/database/entities/socials.entity';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Socials)
    private socialsRepository: EntityRepository<Socials>,
  ) {}

  async create(
    userId: Number,
    createSocialInput: CreateSocialDto,
    connected: "user" | "collection"
  ) {
    const socials = this.socialsRepository.create({
      [connected]: {
        id: userId
      },
      ...createSocialInput,
    });

    await this.socialsRepository.persistAndFlush(socials);
    return socials;
  }

  findAll() {
    return `This action returns all socials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} social`;
  }

  update(id: number, updateSocialDto: UpdateSocialDto) {
    return `This action updates a #${id} social`;
  }

  async remove(id: number) {
    await this.socialsRepository.nativeDelete({ id });
    return true;
  }
}
