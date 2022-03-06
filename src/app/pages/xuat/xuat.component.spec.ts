import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatComponent } from './xuat.component';

describe('QuantriComponent', () => {
  let component: XuatComponent;
  let fixture: ComponentFixture<XuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XuatComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
