import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhPheDuyetTktcTdtComponent } from './thong-tin-quyet-dinh-phe-duyet-tktc-tdt.component';

describe('ThongTinQuyetDinhPheDuyetTktcTdtComponent', () => {
  let component: ThongTinQuyetDinhPheDuyetTktcTdtComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhPheDuyetTktcTdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhPheDuyetTktcTdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhPheDuyetTktcTdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
