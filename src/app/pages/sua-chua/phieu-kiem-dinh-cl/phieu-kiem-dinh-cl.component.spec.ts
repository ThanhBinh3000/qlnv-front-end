import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieuKiemDinhClComponent } from './phieu-kiem-dinh-cl.component';

describe('PhieuKiemDinhClComponent', () => {
  let component: PhieuKiemDinhClComponent;
  let fixture: ComponentFixture<PhieuKiemDinhClComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhieuKiemDinhClComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieuKiemDinhClComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
