import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SocialsService } from './socials.service';
import { CreateSocialInput } from './dto/create-social.input';
import { UpdateSocialInput } from './dto/update-social.input';
import { Socials } from 'src/database/entities/socials.entity';

@Resolver(() => Socials)
export class SocialsResolver {
  constructor(private readonly socialsService: SocialsService) {}

  @Query(() => [Socials], { name: 'socials' })
  findAll() {
    return this.socialsService.findAll();
  }

  @Query(() => Socials, { name: 'social' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.socialsService.findOne(id);
  }

  @Mutation(() => Socials)
  updateSocial(@Args('updateSocialInput') updateSocialInput: UpdateSocialInput) {
    return this.socialsService.update(updateSocialInput.id, updateSocialInput);
  }

  @Mutation(() => Socials)
  removeSocial(@Args('id', { type: () => Int }) id: number) {
    return this.socialsService.remove(id);
  }
}
