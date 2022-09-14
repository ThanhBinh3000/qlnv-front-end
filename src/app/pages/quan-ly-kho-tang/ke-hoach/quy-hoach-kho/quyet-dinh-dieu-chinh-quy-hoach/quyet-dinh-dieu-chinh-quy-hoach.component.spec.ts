import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhDieuChinhQuyHoachComponent } from './quyet-dinh-dieu-chinh-quy-hoach.component';

describe('QuyetDinhDieuChinhQuyHoachComponent', () => {
  let component: QuyetDinhDieuChinhQuyHoachComponent;
  let fixture: ComponentFixture<QuyetDinhDieuChinhQuyHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhDieuChinhQuyHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhDieuChinhQuyHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
