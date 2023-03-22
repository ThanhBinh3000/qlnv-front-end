import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetTktcTdtComponent } from './quyet-dinh-phe-duyet-tktc-tdt.component';

describe('QuyetDinhPheDuyetTktcTdtComponent', () => {
  let component: QuyetDinhPheDuyetTktcTdtComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetTktcTdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetTktcTdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetTktcTdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
