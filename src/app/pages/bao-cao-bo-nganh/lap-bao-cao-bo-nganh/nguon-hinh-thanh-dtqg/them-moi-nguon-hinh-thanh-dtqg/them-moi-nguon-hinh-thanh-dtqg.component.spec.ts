import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiNguonHinhThanhDtqgComponent } from './them-moi-nguon-hinh-thanh-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiNguonHinhThanhDtqgComponent;
  let fixture: ComponentFixture<ThemMoiNguonHinhThanhDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiNguonHinhThanhDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiNguonHinhThanhDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
