import { EntityRepository, expr } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { User } from "../database/entities/user.entity";
import { CharityService } from "src/charity/charity.service";
import { CreateCharityDto } from "src/charity/dto/create-charity.dto";

interface FindAllArgs {
  relations?: string[];
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
  ) {}

  async create(createUserInput: Partial<User>) {
    const user = this.usersRepository.create(createUserInput);
    await this.usersRepository.persistAndFlush(user);
    return user;
  }

  findAll(args?: FindAllArgs) {
    const { relations } = args;
    return this.usersRepository.find({}, relations);
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
    if ('charityProperty' in updateUserInput) {
      const charity = await this.usersRepository.findOne({
        charityProperty: {
          user: {
            id: id
          }
        }
      });
      if (!charity) await this.charityService.create(id, updateUserInput.charityProperty as CreateCharityDto);
      else await this.charityService.update(id, updateUserInput.charityProperty);
    }
    
    const result = await this.findOne({
      id: user.id,
      relations: ["charityProperty", "walletAddresses", "socials"]
    })
    return result;
  }

  async remove(id: number) {
    await this.usersRepository.removeAndFlush({ id });
    return true;
  }
}
