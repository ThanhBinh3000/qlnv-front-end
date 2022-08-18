import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiDeXuatGctComponent } from './them-moi-de-xuat-gct.component';

describe('ThemMoiDeXuatGctComponent', () => {
  let component: ThemMoiDeXuatGctComponent;
  let fixture: ComponentFixture<ThemMoiDeXuatGctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiDeXuatGctComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiDeXuatGctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
