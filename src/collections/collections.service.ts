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
    const collection = this.collectionRepository.findOne({
      id: id
    });
    
    return collection;
  }

  update(id: number, updateCollectionInput: UpdateCollectionInput | UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
