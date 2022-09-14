import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatNhuCauComponent } from './de-xuat-nhu-cau.component';

describe('DeXuatNhuCauComponent', () => {
  let component: DeXuatNhuCauComponent;
  let fixture: ComponentFixture<DeXuatNhuCauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatNhuCauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatNhuCauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
