import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiDmNhomHangComponent } from './dialog-them-moi-dm-nhom-hang.component';

describe('DialogThemMoiDmNhomHangComponent', () => {
  let component: DialogThemMoiDmNhomHangComponent;
  let fixture: ComponentFixture<DialogThemMoiDmNhomHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiDmNhomHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogThemMoiDmNhomHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
