import { TestBed } from '@angular/core/testing';

import { EnoetService } from './enoet.service';

describe('EnoetService', () => {
  let service: EnoetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnoetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
