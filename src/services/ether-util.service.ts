import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sigUtil from "@metamask/eth-sig-util";
import { generate } from "randomstring";

@Injectable()
export class EtherUtilService {
  constructor(private readonly configService: ConfigService) {
    // Don't forget this one.
    // The apiKey is required to authenticate our
    // request to SendGrid API.
  }

  generateNonce() {
    return generate({
      length: 12,
      charset: "numeric",
      capitalization: "uppercase",
    });
  }

  recoverPersonalSignature(nonce: string, signature: string) {
    const message = `Givetree one time nonce: ${nonce}`;
    return sigUtil.recoverPersonalSignature({ data: message, signature });
  }
}
