import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiHopDongComponent } from './them-moi-hop-dong.component';

describe('ThemMoiHopDongComponent', () => {
  let component: ThemMoiHopDongComponent;
  let fixture: ComponentFixture<ThemMoiHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
