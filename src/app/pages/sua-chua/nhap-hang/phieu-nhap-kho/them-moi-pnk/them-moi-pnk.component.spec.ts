import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiPnkComponent } from './them-moi-pnk.component';

describe('ThemMoiPnkComponent', () => {
  let component: ThemMoiPnkComponent;
  let fixture: ComponentFixture<ThemMoiPnkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiPnkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiPnkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
