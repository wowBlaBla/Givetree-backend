import { Selections } from "@jenyus-org/nestjs-graphql-utils";
import { UseGuards } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UserInputError } from "apollo-server-express";
// import { GraphQLUpload, FileUpload } from "graphql-upload";
import { PostObject } from "src/posts/dto/post.object";
import { PostsService } from "src/posts/posts.service";
import { GqlCurrentUser } from "../auth/decorator/gql-current-user.decorator";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { UserObject } from "./dto/user.object";
import { User } from "../database/entities/user.entity";
import { UsersService } from "./users.service";
// import { createWriteStream } from "fs";

@Resolver(() => UserObject)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @Query(() => [UserObject])
  users(@Selections("users", ["posts"]) relations: string[]) {
    return this.usersService.findAll({ relations });
  }

  @Query(() => UserObject)
  user(
    @Selections("user", ["posts"]) relations: string[],
    @Args("id", { type: () => Int, nullable: true }) id?: number,
    @Args("email", { nullable: true }) email?: string,
  ) {
    if (!id && !email) {
      throw new UserInputError("Arguments must be one of ID or email.");
    }
    return this.usersService.findOne({ id, email, relations });
  }

  @Mutation(() => UserObject)
  @UseGuards(GqlAuthGuard)
  updateProfile(
    @GqlCurrentUser() user: User,
    @Args("input") input: UpdateProfileInput,
  ) {
    return this.usersService.update(user.id, input);
  }

  // @Mutation(() => UserObject)
  // @UseGuards(GqlAuthGuard)
  // async uploadProfileImage(
  //   @Args({ name: "file", type: () => GraphQLUpload })
  //   { createReadStream, filename }: FileUpload,
  // ): Promise<boolean> {
  //   return new Promise(async (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(`./uploads/${filename}`))
  //       .on("finish", () => resolve(true))
  //       .on("error", () => reject(false)),
  //   );
  // }

  @Query(() => UserObject)
  @UseGuards(GqlAuthGuard)
  me(@GqlCurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => [PostObject])
  async posts(@Parent() user: User) {
    if (user.posts.isInitialized()) {
      return user.posts;
    }
    const { id } = user;
    return this.postsService.findAll({ authorId: id });
  }
}
