import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NoncesService } from './nonces.service';
import { CreateNonceInput } from './dto/create-nonce.input';
import { UpdateNonceInput } from './dto/update-nonce.input';
import { Nonces } from 'src/database/entities/nonces.entity';

@Resolver(() => Nonces)
export class NoncesResolver {
  constructor(private readonly noncesService: NoncesService) {}

  @Mutation(() => Nonces)
  createNonce(
    @Args("id", { type: () => Int }) id: number,
    @Args('createNonceInput') createNonceInput: CreateNonceInput
  ) {
    return this.noncesService.create(id, createNonceInput);
  }

  @Query(() => [Nonces], { name: 'nonces' })
  findAll() {
    return this.noncesService.findAll();
  }

  @Query(() => Nonces, { name: 'nonce' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.noncesService.findOne(id);
  }

  @Mutation(() => Nonces)
  updateNonce(@Args('updateNonceInput') updateNonceInput: UpdateNonceInput) {
    return this.noncesService.update(updateNonceInput.id, updateNonceInput);
  }

  @Mutation(() => Nonces)
  removeNonce(@Args('id', { type: () => Int }) id: number) {
    return this.noncesService.remove(id);
  }
}
