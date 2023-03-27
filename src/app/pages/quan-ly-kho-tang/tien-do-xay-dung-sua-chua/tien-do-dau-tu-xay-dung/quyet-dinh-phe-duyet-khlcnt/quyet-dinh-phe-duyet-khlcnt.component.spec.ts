import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetKhlcntComponent } from './quyet-dinh-phe-duyet-khlcnt.component';

describe('QuyetDinhPheDuyetKhlcntComponent', () => {
  let component: QuyetDinhPheDuyetKhlcntComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetKhlcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetKhlcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetKhlcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
