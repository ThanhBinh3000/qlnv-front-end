import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhNhComponent } from './quyet-dinh-nh.component';

describe('QuyetDinhNhComponent', () => {
  let component: QuyetDinhNhComponent;
  let fixture: ComponentFixture<QuyetDinhNhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhNhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhNhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
