import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxyService } from './client-proxy';

describe('ClientProxyService', () => {
  let service: ClientProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientProxyService],
    }).compile();

    service = module.get<ClientProxyService>(ClientProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
