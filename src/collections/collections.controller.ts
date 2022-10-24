import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/database/entities/user.entity';
import { S3Service } from 'src/services/s3.service';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
    constructor(
        private readonly collectionsService: CollectionsService,
        private readonly s3Service: S3Service,
    ) {}

    @Get()
    findAll() {
        return this.collectionsService.findAll();
    }

    @Post()
    create(
        @Body() createCollection: CreateCollectionDto
    ) {
        return this.collectionsService.create(createCollection);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateCollection: UpdateCollectionDto
    ) {
        return this.collectionsService.update(+id, updateCollection);
    }

    @UseGuards(JwtAuthGuard)
    @Put("/upload/:id")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                logo: {
                    type: "string",
                    format: "binary",
                },
                featured: {
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
            { name: "logo", maxCount: 1 },
            { name: "featured", maxCount: 1 },
            { name: "banner", maxCount: 1 },
        ]),
    )
    async uploadFile(
        @Param("id") id:string,
        @UploadedFiles()
        files: {
            logo?: Express.Multer.File[];
            featured?: Express.Multer.File[];
            banner?: Express.Multer.File[];
        },
    ) {
        const { logo, banner, featured } = files;

        const updateImage = new UpdateCollectionDto();

        if (logo) {
            const result = await this.s3Service.uploadFile(
                logo[0],
                `logo-${id}`,
                "public",
            );

            updateImage.logo = result.Location;
        }

        if (banner) {
            const result = await this.s3Service.uploadFile(
                banner[0],
                `banner-${id}`,
                "public",
            );
            updateImage.banner = result.Location;
        }

        if (featured) {
            const result = await this.s3Service.uploadFile(
                featured[0],
                `featured-${id}`,
                "public",
            );
            updateImage.featured = result.Location;
        }

        const res = await this.collectionsService.update(+id, updateImage);
        return res;
    }
}
