import { Test, TestingModule } from '@nestjs/testing';
import { CharityResolver } from './charity.resolver';
import { CharityService } from './charity.service';

describe('CharityResolver', () => {
  let resolver: CharityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharityResolver, CharityService],
    }).compile();

    resolver = module.get<CharityResolver>(CharityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
