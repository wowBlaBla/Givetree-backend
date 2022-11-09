import { Test, TestingModule } from '@nestjs/testing';
import { NoncesService } from './nonces.service';

describe('NoncesService', () => {
  let service: NoncesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoncesService],
    }).compile();

    service = module.get<NoncesService>(NoncesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
