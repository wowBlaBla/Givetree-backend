import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Collections } from 'src/database/entities/collections.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionRepository: EntityRepository<Collections>,
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
    return user;
  }

  async remove(id: number) {
    await this.collectionRepository.removeAndFlush({ id });
    return true;
  }
}
