import { TestBed } from '@angular/core/testing';

import { ManageConsultationService } from './manage-consultation.service';

describe('ManageConsultationService', () => {
  let service: ManageConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageConsultationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
