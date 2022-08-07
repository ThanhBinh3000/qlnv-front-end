import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieuChinhKeHoachComponent } from './dieu-chinh-ke-hoach.component';

describe('DieuChinhKeHoachComponent', () => {
  let component: DieuChinhKeHoachComponent;
  let fixture: ComponentFixture<DieuChinhKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieuChinhKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieuChinhKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
