import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatNcChiCucPvcComponent } from './de-xuat-nc-chi-cuc-pvc.component';

describe('DeXuatNcChiCucPvcComponent', () => {
  let component: DeXuatNcChiCucPvcComponent;
  let fixture: ComponentFixture<DeXuatNcChiCucPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatNcChiCucPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatNcChiCucPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
