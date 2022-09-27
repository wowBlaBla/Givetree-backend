import { EntityRepository, expr } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { User } from "../database/entities/user.entity";

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

  async update(
    id: number,
    updateUserInput: UpdateProfileInput | UpdateProfileDto,
  ) {
    const user = await this.usersRepository.findOneOrFail(id);
    this.usersRepository.assign(user, updateUserInput);
    await this.usersRepository.flush();
    return user;
  }

  async remove(id: number) {
    await this.usersRepository.removeAndFlush({ id });
    return true;
  }
}
