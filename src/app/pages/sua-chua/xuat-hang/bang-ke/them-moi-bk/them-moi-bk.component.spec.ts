import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiBkComponent } from './them-moi-bk.component';

describe('ThemMoiBkComponent', () => {
  let component: ThemMoiBkComponent;
  let fixture: ComponentFixture<ThemMoiBkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiBkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiBkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
