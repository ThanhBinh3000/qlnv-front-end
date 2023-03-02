import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhXuatCapComponent } from './quyet-dinh-xuat-cap.component';

describe('QuyetDinhXuatCapComponent', () => {
  let component: QuyetDinhXuatCapComponent;
  let fixture: ComponentFixture<QuyetDinhXuatCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhXuatCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhXuatCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
