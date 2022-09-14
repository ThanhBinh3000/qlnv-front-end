import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhQuyHoachComponent } from './quyet-dinh-quy-hoach.component';

describe('QuyetDinhQuyHoachComponent', () => {
  let component: QuyetDinhQuyHoachComponent;
  let fixture: ComponentFixture<QuyetDinhQuyHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhQuyHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhQuyHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
