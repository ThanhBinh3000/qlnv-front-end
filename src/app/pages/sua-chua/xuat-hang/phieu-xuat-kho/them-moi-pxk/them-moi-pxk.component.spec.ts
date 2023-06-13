import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiPxkComponent } from './them-moi-pxk.component';

describe('ThemMoiPxkComponent', () => {
  let component: ThemMoiPxkComponent;
  let fixture: ComponentFixture<ThemMoiPxkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiPxkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiPxkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
