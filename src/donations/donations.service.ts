import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Donations } from '../database/entities/donations.entity';
import { CreateDonationInput } from './dto/create-donation.input';
import { UpdateDonationInput } from './dto/update-donation.input';

interface FindArgs {
  from?: string;
  to?: string;
}

@Injectable()
export class DonationsService {

  constructor(
    @InjectRepository(Donations)
    private readonly createDonationRepository: EntityRepository<Donations>
  ) { }

  async create(createDonationInput: CreateDonationInput) {
    const donation = this.createDonationRepository.create(createDonationInput);
    await this.createDonationRepository.persistAndFlush(donation);
    return donation;
  }

  findAll() {
    return `This action returns all donations`;
  }

  find(args: FindArgs) {
    return this.createDonationRepository.find(args);
  }

  findOne(id: number) {
    return `This action returns a #${id} donation`;
  }

  update(id: number, updateDonationInput: UpdateDonationInput) {
    return `This action updates a #${id} donation`;
  }

  remove(id: number) {
    return `This action removes a #${id} donation`;
  }
}
