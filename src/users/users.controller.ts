import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserDto } from "./dto/user.dto";
import { User } from "../database/entities/user.entity";
import { UsersService } from "./users.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { S3Service } from "src/services/s3.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => new UserDto(u));
  }

  @Get(":email")
  async findOne(@Param("email") email: string) {
    const user = await this.usersService.findOne({ email });
    return user && new UserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateProfileDto,
  ) {
    const result = await this.usersService.findEither(user.id, updateUserDto);
    if (result) {
      throw new UnauthorizedException(`User already exists.`);
    }
    const res = await this.usersService.update(user.id, updateUserDto);
    return res && new UserDto(res);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile/upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        profile: {
          type: "string",
          format: "binary",
        },
        banner: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "profile", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
  )
  async uploadFile(
    @CurrentUser() user: User,
    @UploadedFiles()
    files: {
      profile?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const { profile, banner } = files;

    const updateImage = new UpdateProfileDto();

    if (profile) {
      const result = await this.s3Service.uploadFile(
        profile[0],
        `profile-${user.id}`,
        "public",
      );

      updateImage.profileImage = result.Location;
    }

    if (banner) {
      const result = await this.s3Service.uploadFile(
        banner[0],
        `banner-${user.id}`,
        "public",
      );
      updateImage.bannerImage = result.Location;
    }

    const res = await this.usersService.update(user.id, updateImage);
    return res && new UserDto(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiOkResponse({
    description: "Returns the logged-in user.",
    type: UserDto,
  })
  getProfile(@CurrentUser() user: User) {
    return user && new UserDto(user);
  }
}
