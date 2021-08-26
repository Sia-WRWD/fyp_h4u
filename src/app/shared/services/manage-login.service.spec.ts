import { TestBed } from '@angular/core/testing';

import { ManageLoginService } from './manage-login.service';

describe('ManageLoginService', () => {
  let service: ManageLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
