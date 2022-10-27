import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CharityProperty } from 'src/database/entities/charity-property.entity';
import { CharityService } from './charity.service';
import { UpdateCharityInput } from './dto/update-charity.input';

@Resolver(() => CharityProperty)
export class CharityResolver {
  constructor(private readonly charityService: CharityService) {}

  @Query(() => [CharityProperty], { name: 'charity' })
  findAll() {
    return this.charityService.findAll();
  }

  @Query(() => CharityProperty, { name: 'charity' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.charityService.findOne(id);
  }

  @Mutation(() => CharityProperty)
  updateCharity(@Args('updateCharityInput') updateCharityInput: UpdateCharityInput) {
    return this.charityService.update(updateCharityInput.id, updateCharityInput);
  }

  @Mutation(() => CharityProperty)
  removeCharity(@Args('id', { type: () => Int }) id: number) {
    return this.charityService.remove(id);
  }
}
