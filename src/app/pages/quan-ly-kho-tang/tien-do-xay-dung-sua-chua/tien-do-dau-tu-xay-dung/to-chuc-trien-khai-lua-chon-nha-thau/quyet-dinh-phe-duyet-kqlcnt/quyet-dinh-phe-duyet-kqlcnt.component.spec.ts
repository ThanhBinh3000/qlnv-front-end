import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetKqlcntComponent } from './quyet-dinh-phe-duyet-kqlcnt.component';

describe('QuyetDinhPheDuyetKqlcntComponent', () => {
  let component: QuyetDinhPheDuyetKqlcntComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetKqlcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetKqlcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetKqlcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
