import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiTongHopKhnkComponent } from './them-moi-tong-hop-khnk.component';

describe('ThemMoiTongHopKhnkComponent', () => {
  let component: ThemMoiTongHopKhnkComponent;
  let fixture: ComponentFixture<ThemMoiTongHopKhnkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiTongHopKhnkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiTongHopKhnkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
