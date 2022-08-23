import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiDeXuatPagComponent } from './them-moi-de-xuat-pag.component';

describe('ThemMoiDeXuatPagComponent', () => {
  let component: ThemMoiDeXuatPagComponent;
  let fixture: ComponentFixture<ThemMoiDeXuatPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiDeXuatPagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiDeXuatPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
