import { TestBed } from '@angular/core/testing';

import { HeaderItemsService } from './header-items.service';

describe('HeaderItemsService', () => {
  let service: HeaderItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
