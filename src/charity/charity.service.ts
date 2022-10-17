import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CharityProperty } from 'src/database/entities/charity-property.entity';
import { CreateCharityInput } from './dto/create-charity.input';
import { UpdateCharityInput } from './dto/update-charity.input';
import { EntityRepository } from '@mikro-orm/mariadb';
import { CreateCharityDto } from './dto/create-charity.dto';
import { UpdateCharityDto } from './dto/update-charity.dto';

@Injectable()
export class CharityService {

  constructor(
    @InjectRepository(CharityProperty)
    private charityPropertyRepository: EntityRepository<CharityProperty>
  ) {}

  async create(
    userId: number,
    createCharityInput: CreateCharityInput | CreateCharityDto
  ) {
    const charity = this.charityPropertyRepository.create({
      user: {
        id: userId
      },
      ...createCharityInput
    });

    await this.charityPropertyRepository.persistAndFlush(charity);
    return charity;
  }

  findAll() {
    return `This action returns all charity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} charity`;
  }

  async update(id: number, updateCharityInput: UpdateCharityInput | UpdateCharityDto) {
    const charity = await this.charityPropertyRepository.findOne({
      user: {
        id: id
      }
    });
    if (charity) {
      this.charityPropertyRepository.assign(charity, updateCharityInput);
      await this.charityPropertyRepository.flush();
    }
    return charity;
  }

  async remove(id: number) {
    await this.charityPropertyRepository.removeAndFlush({ id });
    return true;
  }
}
