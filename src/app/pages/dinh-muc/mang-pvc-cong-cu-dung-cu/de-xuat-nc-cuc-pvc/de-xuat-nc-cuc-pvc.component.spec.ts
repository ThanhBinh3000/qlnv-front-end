import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatNcCucPvcComponent } from './de-xuat-nc-cuc-pvc.component';

describe('DeXuatNcCucPvcComponent', () => {
  let component: DeXuatNcCucPvcComponent;
  let fixture: ComponentFixture<DeXuatNcCucPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatNcCucPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatNcCucPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
