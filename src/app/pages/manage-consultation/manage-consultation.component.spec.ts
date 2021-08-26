import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConsultationComponent } from './manage-consultation.component';

describe('ManageConsultationComponent', () => {
  let component: ManageConsultationComponent;
  let fixture: ComponentFixture<ManageConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
