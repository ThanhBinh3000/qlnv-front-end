import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopDongMuaSamPvcComponent } from './hop-dong-mua-sam-pvc.component';

describe('HopDongMuaSamPvcComponent', () => {
  let component: HopDongMuaSamPvcComponent;
  let fixture: ComponentFixture<HopDongMuaSamPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HopDongMuaSamPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HopDongMuaSamPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
