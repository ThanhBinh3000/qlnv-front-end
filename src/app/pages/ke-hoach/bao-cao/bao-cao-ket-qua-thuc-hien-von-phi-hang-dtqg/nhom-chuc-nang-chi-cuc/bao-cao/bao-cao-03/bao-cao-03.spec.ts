import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao03Component } from './bao-cao-03.component';

describe('BaoCao03Component', () => {
  let component: BaoCao03Component;
  let fixture: ComponentFixture<BaoCao03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao03Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
