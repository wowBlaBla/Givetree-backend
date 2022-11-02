import { EntityRepository, expr } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { User } from "../database/entities/user.entity";
import { CharityService } from "src/charity/charity.service";
import { WalletAddressesService } from "src/walletAddresses/wallet-addresses.service";
import { CreateWalletAddressDto } from "src/walletAddresses/dto/create-wallet-address.dto";
import { SocialsService } from "src/socials/socials.service";

export interface FindAllArgs {
  relations?: string[];
  type?: string;
}

interface FindOneArgs extends FindAllArgs {
  id?: number;
  email?: string;
  userName?: string;
  walletAddress?: CreateWalletAddressDto;
  postId?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: EntityRepository<User>,
    private charityService: CharityService,
    private walletAddressesService: WalletAddressesService,
    private socialsService: SocialsService,
  ) {}

  async create(createUserInput: Partial<User>) {
    const user = this.usersRepository.create(createUserInput);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  findAll(args?: FindOneArgs) {
    const { relations, type, userName } = args;
    const query: FindOneArgs =
      type == "standard" || type == "charity" ? { type } : {};
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
        { walletAddresses: walletAddress },
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
          walletAddresses: walletAddress,
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
    updateUserInput: Omit<
      UpdateProfileDto,
      "email" | "userName" | "walletAddress"
    >,
  ) {
    const user = await this.usersRepository.findOneOrFail(id);
    const { charityProperty, socials, ...res } = updateUserInput;

    this.usersRepository.assign(user, res);

    await this.charityService.removeByUserId(id);
    if (charityProperty) {
      await this.charityService.create(id, charityProperty);
    }

    if (socials) {
      await this.socialsService.removeByUserId(id);
      for (let i = 0; i < socials.length; i++) {
        await this.socialsService.create(id, socials[i], "user");
      }
    }

    this.usersRepository.flush();
    const result = await this.findOne({
      id: user.id,
      relations: ["charityProperty", "walletAddresses", "socials"],
    });

    return result;
  }

  async updateAccounts(
    id: number,
    updateUserInput: Pick<
      UpdateProfileDto,
      "email" | "userName" | "walletAddress"
    >,
  ) {
    const user = await this.usersRepository.findOneOrFail(id);
    const { walletAddress, ...res } = updateUserInput;
    this.usersRepository.assign(user, res);

    if (walletAddress) {
      await this.walletAddressesService.removeByUserIdAndType(
        id,
        walletAddress.type,
      );

      await this.walletAddressesService.create(id, walletAddress);
    }

    this.usersRepository.flush();
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
