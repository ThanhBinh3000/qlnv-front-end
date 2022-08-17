import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhBtcPagComponent } from './quyet-dinh-btc-pag.component';

describe('QuyetDinhBtcPagComponent', () => {
  let component: QuyetDinhBtcPagComponent;
  let fixture: ComponentFixture<QuyetDinhBtcPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhBtcPagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhBtcPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
