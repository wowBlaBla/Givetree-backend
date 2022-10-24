import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Collections } from 'src/database/entities/collections.entity';
import { CreateSocialDto } from 'src/socials/dto/create-social.dto';
import { SocialsService } from 'src/socials/socials.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionRepository: EntityRepository<Collections>,
    private socialService: SocialsService
  ) {}

  async create(createCollectionInput: CreateCollectionDto | CreateCollectionInput) {
    const collection = this.collectionRepository.create(createCollectionInput);
    await this.collectionRepository.persistAndFlush(collection);
    return collection;
  }

  findAll() {
    return this.collectionRepository.findAll();
  }

  async findOne(id: number) {
    const collection = await this.collectionRepository.findOne({
      id: id
    });
    
    return collection;
  }

  async update(id: number, updateCollectionInput: UpdateCollectionInput | UpdateCollectionDto) {
    const user = await this.collectionRepository.findOneOrFail(id);
    this.collectionRepository.assign(user, updateCollectionInput);
    await this.collectionRepository.flush();
    if ('socials' in updateCollectionInput) {
      const socials = await this.collectionRepository.findOne({
        socials: {
          collection: {
            id: id
          }
        }
      });
      if (socials) {
        await this.socialService.remove(id);
      }
      const _socials = updateCollectionInput.socials;
      for (let i = 0; i < _socials.length; i ++) {
        await this.socialService.create(id, updateCollectionInput.socials[i] as CreateSocialDto, "collection");
      }
    }
    return user;
  }

  async remove(id: number) {
    await this.collectionRepository.removeAndFlush({ id });
    return true;
  }
}
