import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import * as path from "path";

@Injectable()
export class S3Service {
  s3: AWS.S3;
  config: ConfigService;

  constructor(configService: ConfigService) {
    this.s3 = new AWS.S3();
    this.config = configService;
  }

  async uploadFile(file: Express.Multer.File, id: string, dir?: string) {
    const { buffer, mimetype, originalname } = file;
    const now = new Date().getTime();

    const extension = path.extname(originalname);
    const key = `${
      dir ? String(`${dir}/${id}`) : String(id)
    }-${now}${extension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.config.get<string>("cdn.s3Bucket"),
      Key: key,
      Body: buffer,
      ACL: "private",
      ContentType: mimetype,
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      const filename = path.basename(s3Response.Location);

      return {
        ...s3Response,
        Location: `${this.config.get<string>("cdn.baseURL")}/${filename}`,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
