import { Test, TestingModule } from '@nestjs/testing';
import { NoncesResolver } from './nonces.resolver';
import { NoncesService } from './nonces.service';

describe('NoncesResolver', () => {
  let resolver: NoncesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoncesResolver, NoncesService],
    }).compile();

    resolver = module.get<NoncesResolver>(NoncesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
