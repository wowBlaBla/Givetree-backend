import { Test, TestingModule } from '@nestjs/testing';
import { NoncesController } from './nonces.controller';

describe('NoncesController', () => {
  let controller: NoncesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoncesController],
    }).compile();

    controller = module.get<NoncesController>(NoncesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
