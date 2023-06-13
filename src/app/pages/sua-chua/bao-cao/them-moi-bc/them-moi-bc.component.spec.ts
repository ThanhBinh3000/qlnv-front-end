import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiBcComponent } from './them-moi-bc.component';

describe('ThemMoiBcComponent', () => {
  let component: ThemMoiBcComponent;
  let fixture: ComponentFixture<ThemMoiBcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiBcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
