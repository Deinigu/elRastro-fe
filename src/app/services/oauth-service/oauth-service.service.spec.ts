import { TestBed } from '@angular/core/testing';

import { OauthServiceService } from './oauth-service.service';

describe('OauthServiceService', () => {
  let service: OauthServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OauthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
