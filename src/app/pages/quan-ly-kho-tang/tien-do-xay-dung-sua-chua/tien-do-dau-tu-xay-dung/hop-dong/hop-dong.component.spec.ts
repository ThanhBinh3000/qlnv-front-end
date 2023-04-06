import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HopDongComponent } from './hop-dong.component';

describe('HopDongComponent', () => {
  let component: HopDongComponent;
  let fixture: ComponentFixture<HopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
