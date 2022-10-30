import { EntityRepository } from '@mikro-orm/mariadb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Sales } from 'src/database/entities/sales.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSaleInput } from './dto/create-sale.input';
import { UpdateSaleInput } from './dto/update-sale.input';
import { Where } from './sales.controller';

@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sales)
    private readonly saleRepository: EntityRepository<Sales>
  ) { }

  async create(createSaleInput: CreateSaleInput | CreateSaleDto) {
    const existed = await this.saleRepository.findOne({
      collection: createSaleInput.collection,
      tokenId: createSaleInput.tokenId
    });

    if (existed) return "Already listed";
    const sale = this.saleRepository.create(createSaleInput);
    await this.saleRepository.persistAndFlush(sale);
    return sale;
  }

  async findAll() {
    const sales = await this.saleRepository.findAll();
    return sales;
  }

  async find(seller: string) {
    const sales = await this.saleRepository.find({ seller });
    return sales;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleInput: UpdateSaleInput) {
    return `This action updates a #${id} sale`;
  }

  async remove(where: Where) {
    await this.saleRepository.nativeDelete({ ...where });
    return true;
  }
}