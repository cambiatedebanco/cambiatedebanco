import { TestBed } from '@angular/core/testing';

import { ApiCardifService } from './api-cardif.service';

describe('ApiCardifService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCardifService = TestBed.get(ApiCardifService);
    expect(service).toBeTruthy();
  });
});
