import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import * as path from "path";

@Injectable()
export class S3Service {
  s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File, id: string, dir?: string) {
    const { buffer, mimetype, originalname } = file;
    const now = new Date().getTime();

    const extension = path.extname(originalname);
    const key = `${
      dir ? String(`${dir}/${id}`) : String(id)
    }-${now}${extension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET,
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
        Location: `https://cdn.tst.givetree.xyz/${filename}`,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
