import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Collections } from 'src/database/entities/collections.entity';
import { CollectionsService } from './collections.service';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';

interface Queries {
  category?: string;
  network?: string;
};

@Resolver(() => Collections)
export class CollectionsResolver {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Mutation(() => Collections)
  createCollection(@Args('createCollectionInput') createCollectionInput: CreateCollectionInput) {
    return this.collectionsService.create(createCollectionInput);
  }

  @Query(() => [Collections], { name: 'collections' })
  findAll(queries: Queries) {
    return this.collectionsService.findAll(queries);
  }

  @Query(() => Collections, { name: 'collection' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.collectionsService.findOne(id);
  }

  @Mutation(() => Collections)
  updateCollection(@Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput) {
    return this.collectionsService.update(updateCollectionInput.id, updateCollectionInput);
  }

  @Mutation(() => Collections)
  removeCollection(@Args('id', { type: () => Int }) id: number) {
    return this.collectionsService.remove(id);
  }
}
