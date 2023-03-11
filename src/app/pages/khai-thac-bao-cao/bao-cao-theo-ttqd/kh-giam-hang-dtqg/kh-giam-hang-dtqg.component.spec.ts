import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhGiamHangDtqgComponent } from './kh-giam-hang-dtqg.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: KhGiamHangDtqgComponent;
  let fixture: ComponentFixture<KhGiamHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhGiamHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhGiamHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
