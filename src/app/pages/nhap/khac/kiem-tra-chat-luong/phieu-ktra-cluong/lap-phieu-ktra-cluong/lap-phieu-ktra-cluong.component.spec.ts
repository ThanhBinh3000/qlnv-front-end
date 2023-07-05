import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapPhieuKtraCluongComponent } from './lap-phieu-ktra-cluong.component';

describe('LapPhieuKtraCluongComponent', () => {
  let component: LapPhieuKtraCluongComponent;
  let fixture: ComponentFixture<LapPhieuKtraCluongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LapPhieuKtraCluongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LapPhieuKtraCluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
