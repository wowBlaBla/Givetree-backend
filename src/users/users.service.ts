import { EntityRepository, expr } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { User } from "../database/entities/user.entity";
import { CharityService } from "src/charity/charity.service";
import { CreateCharityDto } from "src/charity/dto/create-charity.dto";
import { WalletAddressesService } from "src/walletAddresses/wallet-addresses.service";
import { CreateWalletAddressDto } from "src/walletAddresses/dto/create-wallet-address.dto";
export interface FindAllArgs {
  relations?: string[];
  type?: string;
}

interface FindOneArgs extends FindAllArgs {
  id?: number;
  email?: string;
  userName?: string;
  walletAddress?: string;
  postId?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    private charityService: CharityService,
    private walletAddressesService: WalletAddressesService,
  ) {}

  async create(createUserInput: Partial<User>) {
    const user = this.usersRepository.create(createUserInput);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  findAll(args?: FindOneArgs) {
    const { relations, type, userName } = args;
    let query:FindOneArgs = (type == 'standard' || type == 'charity') ? { type } : {};
    if (userName) query.userName = userName;
    return this.usersRepository.find(query, relations);
  }

  findOne({
    id,
    email,
    userName,
    walletAddress,
    postId,
    relations,
  }: FindOneArgs) {
    if (id) {
      return this.usersRepository.findOne(id, relations);
    } else if (email) {
      return this.usersRepository.findOne(
        { [expr("lower(email)")]: email.toLowerCase() },
        relations,
      );
    } else if (userName) {
      return this.usersRepository.findOne(
        { [expr("lower(user_name)")]: userName.toLowerCase() },
        relations,
      );
    } else if (walletAddress) {
      return this.usersRepository.findOne(
        { walletAddresses: { address: walletAddress } },
        relations,
      );
    } else if (postId) {
      return this.usersRepository.findOne({ posts: { id: postId } }, relations);
    } else {
      throw new Error(
        "One of ID, email, walletAddressId or post ID must be provided.",
      );
    }
  }

  async findEither(
    id: number,
    { email, userName, walletAddress, relations }: FindOneArgs,
  ) {
    const condition = { $or: [] };
    let user: User;

    if (email || userName || walletAddress) {
      if (email) {
        condition["$or"].push({
          [expr("lower(email)")]: email.toLowerCase(),
        });
      }
      if (userName) {
        condition["$or"].push({
          [expr("lower(user_name)")]: userName.toLowerCase(),
        });
      }
      if (walletAddress) {
        condition["$or"].push({
          walletAddresses: { address: walletAddress },
        });
      }
      const res = await this.usersRepository.find(
        {
          $and: [{ id: { $ne: id } }, condition],
        },
        relations,
      );
      user = res[0];
    }

    return user;
  }

  async update(
    id: number,
    updateUserInput: UpdateProfileInput | UpdateProfileDto,
  ) {
    const user = await this.usersRepository.findOneOrFail(id);
    this.usersRepository.assign(user, updateUserInput);
    await this.usersRepository.flush();
    if ("charityProperty" in updateUserInput) {
      const charity = await this.usersRepository.findOne({
        charityProperty: {
          user: {
            id: id,
          },
        },
      });
      if (!charity)
        await this.charityService.create(
          id,
          updateUserInput.charityProperty as CreateCharityDto,
        );
      else {
        await this.charityService.remove(id);
        await this.charityService.create(
          id,
          updateUserInput.charityProperty as CreateCharityDto,
        );
      }
    }

    if ("walletAddress" in updateUserInput) {
      const existingUser = await this.walletAddressesService.findOneByAddress({
        address: updateUserInput.walletAddress,
      });
      if (existingUser) {
        return null;
      }

      const walletAddress = await this.usersRepository.findOne({
        walletAddresses: {
          user: {
            id: id,
          },
        },
      });

      const newWalletAddress = {
        address: updateUserInput.walletAddress,
      };

      if (!walletAddress)
        await this.walletAddressesService.create(
          id,
          newWalletAddress as CreateWalletAddressDto,
        );
      else {
        await this.walletAddressesService.remove(id);
        await this.walletAddressesService.create(
          id,
          newWalletAddress as CreateWalletAddressDto,
        );
      }
    }

    const result = await this.findOne({
      id: user.id,
      relations: ["charityProperty", "walletAddresses", "socials"],
    });
    return result;
  }

  async remove(id: number) {
    await this.usersRepository.nativeDelete({ id });
    return true;
  }
}
