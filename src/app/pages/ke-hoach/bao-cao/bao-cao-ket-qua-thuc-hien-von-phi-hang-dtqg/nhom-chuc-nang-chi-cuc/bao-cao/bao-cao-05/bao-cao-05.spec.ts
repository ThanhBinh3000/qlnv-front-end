import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao05Component } from './bao-cao-05.component';

describe('BaoCao05Component', () => {
  let component: BaoCao05Component;
  let fixture: ComponentFixture<BaoCao05Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao05Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
