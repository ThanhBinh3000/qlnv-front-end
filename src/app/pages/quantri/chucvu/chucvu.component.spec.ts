import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChucvuComponent } from './chucvu.component';

describe('ChucvuComponent', () => {
  let component: ChucvuComponent;
  let fixture: ComponentFixture<ChucvuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChucvuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChucvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
