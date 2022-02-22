import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemchucvuComponent } from './themchucvu.component';

describe('ThemchucvuComponent', () => {
  let component: ThemchucvuComponent;
  let fixture: ComponentFixture<ThemchucvuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemchucvuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemchucvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
