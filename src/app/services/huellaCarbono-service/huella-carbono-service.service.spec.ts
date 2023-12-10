import { TestBed } from '@angular/core/testing';

import { HuellaCarbonoServiceService } from './huella-carbono-service.service';

describe('HuellaCarbonoServiceService', () => {
  let service: HuellaCarbonoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuellaCarbonoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
