import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongtinDieuchinhVtComponent } from './thongtin-dieuchinh-vt.component';

describe('ThongtinDieuchinhVtComponent', () => {
  let component: ThongtinDieuchinhVtComponent;
  let fixture: ComponentFixture<ThongtinDieuchinhVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongtinDieuchinhVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongtinDieuchinhVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
