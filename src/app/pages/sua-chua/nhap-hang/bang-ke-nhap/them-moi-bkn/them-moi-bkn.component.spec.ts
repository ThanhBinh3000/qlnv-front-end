import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiBknComponent } from './them-moi-bkn.component';

describe('ThemMoiBknComponent', () => {
  let component: ThemMoiBknComponent;
  let fixture: ComponentFixture<ThemMoiBknComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiBknComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiBknComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
