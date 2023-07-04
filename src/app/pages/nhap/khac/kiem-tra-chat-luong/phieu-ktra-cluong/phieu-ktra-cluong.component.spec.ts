import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieuKtraCluongComponent } from './phieu-ktra-cluong.component';

describe('PhieuKtraCluongComponent', () => {
  let component: PhieuKtraCluongComponent;
  let fixture: ComponentFixture<PhieuKtraCluongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhieuKtraCluongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieuKtraCluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
