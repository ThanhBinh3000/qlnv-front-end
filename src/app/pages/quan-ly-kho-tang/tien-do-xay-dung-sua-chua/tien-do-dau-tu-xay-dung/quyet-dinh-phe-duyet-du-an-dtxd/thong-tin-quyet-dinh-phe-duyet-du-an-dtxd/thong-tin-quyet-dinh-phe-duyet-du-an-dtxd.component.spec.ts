import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhPheDuyetDuAnDtxdComponent } from './thong-tin-quyet-dinh-phe-duyet-du-an-dtxd.component';

describe('ThongTinQuyetDinhPheDuyetDuAnDtxdComponent', () => {
  let component: ThongTinQuyetDinhPheDuyetDuAnDtxdComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhPheDuyetDuAnDtxdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhPheDuyetDuAnDtxdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhPheDuyetDuAnDtxdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
