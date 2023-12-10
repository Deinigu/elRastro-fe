import { TestBed } from '@angular/core/testing';

import { PujaService } from './puja-service.service';

describe('PujaService', () => {
  let service: PujaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PujaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
