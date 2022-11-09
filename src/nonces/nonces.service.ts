import { EntityRepository } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import { Nonces } from 'src/database/entities/nonces.entity';
import { CreateNonceInput } from './dto/create-nonce.input';
import { UpdateNonceInput } from './dto/update-nonce.input';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UsersService } from 'src/users/users.service';
import { ValidateSignInput } from './dto/validate-sign.input';
import * as sigUtil from "eth-sig-util";

@Injectable()
export class NoncesService {

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Nonces)
    private readonly nonceRepository: EntityRepository<Nonces>,
  ) { }

  async create(userId: number, createNonceInput: CreateNonceInput) {
    const { walletAddress, signType } = createNonceInput;
    const user = await this.usersService.findOne({
      walletAddress: { address: walletAddress, network: "ethereum", type: signType == "switch" ? "donation" : "auth" },
      relations: ["charityProperty", "walletAddresses", "socials"],
    });
    if (!user) return null;

    const exist = await this.nonceRepository.findOne(createNonceInput);
    var randomstring = require("randomstring");
    if (!exist) {
      let nonce = randomstring.generate({
        length: 32,
        charset : "hex"
      });
      nonce = nonce.slice(0,8) + '-' + nonce.slice(9, 13) + '-' + nonce.slice(13, 17) + '-' + nonce.slice(17, 21) + '-' + nonce.slice(-12);
      const inputs = {
        nonce,
        signer: {
          id: userId,
        },
        signType,
        walletAddress
      };

      const record = this.nonceRepository.create(inputs);
      await this.nonceRepository.persistAndFlush(record);

      return record;
    }
    else return exist;
  }

  async validateSignature(userId: number, validateSignInput: ValidateSignInput) {
    const { walletAddress, signType, signature } = validateSignInput;
    const exist = await this.nonceRepository.findOne({
      walletAddress,
      signer: {
        id: userId
      },
      signType
    });

    if (exist) {
      const message = `Welcome to GiveTree!\n`+
      `Click to sign in and accept the GiveTree Terms of Service:\n`+
      `This request will not trigger a blockchain transaction or cost any gas fees.\n`+
      `Wallet address:\n`+
      `${walletAddress}\n`+
      `Nonce:\n`+
      `${exist.nonce}`;
      const msgParams = [
        {
          type: "string",
          name: "Message",
          value: message
        }
      ];
      const recovered = sigUtil.recoverTypedSignatureLegacy({
        data: msgParams,
        sig: signature
      });

      await this.nonceRepository.nativeDelete({ id: exist.id });
      if (recovered.toLowerCase() == walletAddress.toLowerCase()) return true;
      else return false;
    }

    return false;
  }

  findAll() {
    return `This action returns all nonces`;
  }

  async findOne(id: number) {
    return await this.nonceRepository.findOne({ id });
  }

  update(id: number, updateNonceInput: UpdateNonceInput) {
    return `This action updates a #${id} nonce`;
  }

  remove(id: number) {
    return this.nonceRepository.nativeDelete({ id });
  }
}
