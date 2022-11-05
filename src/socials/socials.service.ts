import { EntityRepository } from "@mikro-orm/mariadb";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Socials } from "src/database/entities/socials.entity";
import { CreateSocialDto } from "./dto/create-social.dto";
import { UpdateSocialDto } from "./dto/update-social.dto";
import { Controller, Get, HttpException } from '@nestjs/common';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Socials)
    private socialsRepository: EntityRepository<Socials>,
  ) {}

  async create(
    userId: number,
    createSocialInput: CreateSocialDto,
    connected: "user" | "collection",
  ) {
    const socials = this.socialsRepository.create({
      [connected]: {
        id: userId,
      },
      ...createSocialInput,
    });

    await this.socialsRepository.persistAndFlush(socials);
    return socials;
  }

  findAll() {
    throw new HttpException({ message: 'Sample Error' }, 500);
    return `This action returns all socials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} social`;
  }

  update(id: number, updateSocialDto: UpdateSocialDto) {
    return `This action updates a #${id} social`;
  }

  remove(id: number) {
    return this.socialsRepository.nativeDelete({ id });
  }

  async removeByUserId(userId: number) {
    const socials = await this.socialsRepository.find({ user: { id: userId } });
    await this.socialsRepository.removeAndFlush(socials);
    // return this.socialsRepository.nativeDelete({
    //   user: {
    //     id: userId,
    //   },
    // });
  }

  removeByCollectionId(collectionId: number) {
    return this.socialsRepository.removeAndFlush({
      collection: {
        id: collectionId,
      },
    });
  }
}
