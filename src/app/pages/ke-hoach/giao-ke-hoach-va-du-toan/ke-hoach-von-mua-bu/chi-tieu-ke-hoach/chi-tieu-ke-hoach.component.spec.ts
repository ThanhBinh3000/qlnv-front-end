import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTieuKeHoachComponent } from './chi-tieu-ke-hoach.component';

describe('ChiTieuKeHoachComponent', () => {
  let component: ChiTieuKeHoachComponent;
  let fixture: ComponentFixture<ChiTieuKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTieuKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTieuKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
