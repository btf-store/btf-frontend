import { TestBed } from '@angular/core/testing';

import { BranchTypeService } from './branch-type.service';

describe('BranchTypeService', () => {
  let service: BranchTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
