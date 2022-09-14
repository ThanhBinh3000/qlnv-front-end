import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetKeHoachComponent } from './quyet-dinh-phe-duyet-ke-hoach.component';

describe('QuyetDinhPheDuyetKeHoachComponent', () => {
  let component: QuyetDinhPheDuyetKeHoachComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
