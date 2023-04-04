import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhPheDuyetKqlcntComponent } from './thong-tin-quyet-dinh-phe-duyet-kqlcnt.component';

describe('ThongTinQuyetDinhPheDuyetKqlcntComponent', () => {
  let component: ThongTinQuyetDinhPheDuyetKqlcntComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhPheDuyetKqlcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhPheDuyetKqlcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhPheDuyetKqlcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
