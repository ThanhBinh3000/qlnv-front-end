import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChotDieuChinhComponent } from './chot-dieu-chinh.component';

describe('ChotDieuChinhComponent', () => {
  let component: ChotDieuChinhComponent;
  let fixture: ComponentFixture<ChotDieuChinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChotDieuChinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChotDieuChinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
