import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhPheDuyetKhlcntComponent } from './thong-tin-quyet-dinh-phe-duyet-khlcnt.component';

describe('ThongTinQuyetDinhPheDuyetKhlcntComponent', () => {
  let component: ThongTinQuyetDinhPheDuyetKhlcntComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhPheDuyetKhlcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhPheDuyetKhlcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhPheDuyetKhlcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
