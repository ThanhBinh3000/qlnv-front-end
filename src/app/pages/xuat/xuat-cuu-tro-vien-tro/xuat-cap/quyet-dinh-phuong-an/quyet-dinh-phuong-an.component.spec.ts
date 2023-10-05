import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPhuongAnComponent } from './quyet-dinh-phuong-an.component';

describe('QuyetDinhPhuongAnComponent', () => {
  let component: QuyetDinhPhuongAnComponent;
  let fixture: ComponentFixture<QuyetDinhPhuongAnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPhuongAnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPhuongAnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
