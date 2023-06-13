import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhapHangComponent } from './nhap-hang.component';

describe('NhapHangComponent', () => {
  let component: NhapHangComponent;
  let fixture: ComponentFixture<NhapHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhapHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhapHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
