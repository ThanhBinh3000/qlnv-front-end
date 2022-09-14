import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetKhxdComponent } from './quyet-dinh-phe-duyet-khxd.component';

describe('QuyetDinhPheDuyetKhxdComponent', () => {
  let component: QuyetDinhPheDuyetKhxdComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetKhxdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetKhxdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetKhxdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
