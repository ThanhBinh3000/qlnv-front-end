import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangKeXuatVatTuComponent } from './bang-ke-xuat-vat-tu.component';

describe('BangKeXuatVatTuComponent', () => {
  let component: BangKeXuatVatTuComponent;
  let fixture: ComponentFixture<BangKeXuatVatTuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangKeXuatVatTuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BangKeXuatVatTuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
