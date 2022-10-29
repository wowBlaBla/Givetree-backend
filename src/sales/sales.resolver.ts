import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SalesService } from './sales.service';
import { CreateSaleInput } from './dto/create-sale.input';
import { UpdateSaleInput } from './dto/update-sale.input';
import { Sales } from 'src/database/entities/sales.entity';

@Resolver(() => Sales)
export class SalesResolver {
  constructor(private readonly salesService: SalesService) {}

  @Mutation(() => Sales)
  createSale(@Args('createSaleInput') createSaleInput: CreateSaleInput) {
    return this.salesService.create(createSaleInput);
  }

  @Query(() => [Sales], { name: 'sales' })
  findAll() {
    return this.salesService.findAll();
  }

  @Query(() => Sales, { name: 'sale' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.salesService.findOne(id);
  }

  @Mutation(() => Sales)
  updateSale(@Args('updateSaleInput') updateSaleInput: UpdateSaleInput) {
    return this.salesService.update(updateSaleInput.id, updateSaleInput);
  }

  @Mutation(() => Sales)
  removeSale(@Args('id', { type: () => Int }) id: number) {
    return this.salesService.remove(id);
  }
}
