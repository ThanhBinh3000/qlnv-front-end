import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongKeTruyCapComponent } from './thong-ke-truy-cap.component';

describe('ThongKeTruyCapComponent', () => {
  let component: ThongKeTruyCapComponent;
  let fixture: ComponentFixture<ThongKeTruyCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongKeTruyCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongKeTruyCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
