import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KetChuyenComponent } from './ket-chuyen.component';

describe('KetChuyenComponent', () => {
  let component: KetChuyenComponent;
  let fixture: ComponentFixture<KetChuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KetChuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KetChuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
