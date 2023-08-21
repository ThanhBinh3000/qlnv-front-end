import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongtinDexuatVtComponent } from './thongtin-dexuat-vt.component';

describe('ThongtinDexuatVtComponent', () => {
  let component: ThongtinDexuatVtComponent;
  let fixture: ComponentFixture<ThongtinDexuatVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongtinDexuatVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongtinDexuatVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
