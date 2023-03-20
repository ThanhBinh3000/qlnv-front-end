import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetDuAnDtxdComponent } from './quyet-dinh-phe-duyet-du-an-dtxd.component';

describe('QuyetDinhPheDuyetDuAnDtxdComponent', () => {
  let component: QuyetDinhPheDuyetDuAnDtxdComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetDuAnDtxdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetDuAnDtxdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetDuAnDtxdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
