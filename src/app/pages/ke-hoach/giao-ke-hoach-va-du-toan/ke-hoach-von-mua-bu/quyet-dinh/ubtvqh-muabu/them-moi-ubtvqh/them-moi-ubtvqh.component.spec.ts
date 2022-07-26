import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiUbtvqhComponent } from './them-moi-ubtvqh.component';

describe('ThemMoiUbtvqhComponent', () => {
  let component: ThemMoiUbtvqhComponent;
  let fixture: ComponentFixture<ThemMoiUbtvqhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiUbtvqhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiUbtvqhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
