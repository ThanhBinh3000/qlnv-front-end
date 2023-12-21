import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KquaNhapVtComponent } from './kqua-nhap-vt.component';

describe('KquaNhapVtComponent', () => {
  let component: KquaNhapVtComponent;
  let fixture: ComponentFixture<KquaNhapVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KquaNhapVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KquaNhapVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
