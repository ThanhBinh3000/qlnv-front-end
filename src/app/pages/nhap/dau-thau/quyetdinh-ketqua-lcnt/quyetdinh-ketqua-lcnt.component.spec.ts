import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt.component';

describe('QuyetdinhKetquaLcntComponent', () => {
  let component: QuyetdinhKetquaLcntComponent;
  let fixture: ComponentFixture<QuyetdinhKetquaLcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetdinhKetquaLcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetdinhKetquaLcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
