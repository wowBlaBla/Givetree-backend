import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { User } from "src/database/entities/user.entity";
import { CharityService } from "./charity.service";
import { CreateCharityDto } from "./dto/create-charity.dto";
import { UpdateCharityDto } from "./dto/update-charity.dto";

@Controller("charity-profile")
export class CharityController {
  constructor(private readonly charityService: CharityService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createCharityDto: CreateCharityDto,
  ) {
    return this.charityService.create(user.id, createCharityDto);
  }

  @Get()
  findAll() {
    return this.charityService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.charityService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() UpdateCharityDto: UpdateCharityDto) {
    return this.charityService.update(+id, UpdateCharityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.charityService.remove(+id);
  }
}
