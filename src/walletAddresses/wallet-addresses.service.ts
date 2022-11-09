import { EntityRepository, FilterQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { CreateWalletAddressDto } from "./dto/create-wallet-address.dto";
import { CreateWalletAddressInput } from "./dto/create-wallet-address.input";
import { UpdateWalletAddressDto } from "./dto/update-wallet-address.dto";
import { WalletAddress } from "src/database/entities/wallet-address.entity";

interface FindAllArgs {
  relations?: string[];
  userId?: number;
}

interface FindOneArgs extends FindAllArgs {
  id: number;
}

interface FindOneByAddressArgs {
  address: string;
}

@Injectable()
export class WalletAddressesService {
  constructor(
    @InjectRepository(WalletAddress)
    private walletAddressesRepository: EntityRepository<WalletAddress>,
  ) {}

  async create(
    userId: number,
    createWalletAddressInput: CreateWalletAddressDto | CreateWalletAddressInput,
  ) {
    const walletAddress = this.walletAddressesRepository.create({
      user: {
        id: userId,
      },
      ...createWalletAddressInput,
    });
    await this.walletAddressesRepository.persistAndFlush(walletAddress);
    return walletAddress;
  }

  findAll(args?: FindAllArgs) {
    const { relations, userId } = args;
    let where: FilterQuery<WalletAddress> = {};
    if (userId) {
      where = { ...where, user: { id: userId } };
    }
    return this.walletAddressesRepository.find(where, relations);
  }

  findOne({ id, relations }: FindOneArgs) {
    return this.walletAddressesRepository.findOne(id, relations);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findOneByAddress({ address }: FindOneByAddressArgs) {
    const walletAddressResults = await this.walletAddressesRepository.find({
      address,
    });

    if (walletAddressResults.length) {
      return walletAddressResults[0];
    } else {
      return null;
    }
  }

  async update(id: number, updateWalletAddressInput: UpdateWalletAddressDto) {
    const walletAddress = await this.walletAddressesRepository.findOne(id);
    this.walletAddressesRepository.assign(
      walletAddress,
      updateWalletAddressInput,
    );
    await this.walletAddressesRepository.flush();
    return walletAddress;
  }

  async remove(id: number) {
    await this.walletAddressesRepository.nativeDelete({ id });
    return true;
  }

  async removeByUserIdAndType(userId: number, type: string, network: string) {
    return this.walletAddressesRepository.nativeDelete({
      type,
      network,
      user: { id: userId },
    });
  }
}
