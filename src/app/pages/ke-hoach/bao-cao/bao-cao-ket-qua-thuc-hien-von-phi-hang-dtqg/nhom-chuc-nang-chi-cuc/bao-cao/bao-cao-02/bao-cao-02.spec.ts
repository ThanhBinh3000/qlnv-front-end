import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao02Component } from './bao-cao-02.component';

describe('BaoCao02Component', () => {
  let component: BaoCao02Component;
  let fixture: ComponentFixture<BaoCao02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao02Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
