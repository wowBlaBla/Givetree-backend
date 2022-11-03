import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Donations } from 'src/database/entities/donations.entity';
import { DonationsService } from './donations.service';
import { CreateDonationInput } from './dto/create-donation.input';
import { UpdateDonationInput } from './dto/update-donation.input';

@Resolver(() => Donations)
export class DonationsResolver {
  constructor(private readonly donationsService: DonationsService) {}

  @Mutation(() => Donations)
  createDonation(@Args('createDonationInput') createDonationInput: CreateDonationInput) {
    return this.donationsService.create(createDonationInput);
  }

  @Query(() => [Donations], { name: 'donations' })
  findAll() {
    return this.donationsService.findAll();
  }

  @Query(() => Donations, { name: 'donation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.donationsService.findOne(id);
  }

  @Mutation(() => Donations)
  updateDonation(@Args('updateDonationInput') updateDonationInput: UpdateDonationInput) {
    return this.donationsService.update(updateDonationInput.id, updateDonationInput);
  }

  @Mutation(() => Donations)
  removeDonation(@Args('id', { type: () => Int }) id: number) {
    return this.donationsService.remove(id);
  }
}
