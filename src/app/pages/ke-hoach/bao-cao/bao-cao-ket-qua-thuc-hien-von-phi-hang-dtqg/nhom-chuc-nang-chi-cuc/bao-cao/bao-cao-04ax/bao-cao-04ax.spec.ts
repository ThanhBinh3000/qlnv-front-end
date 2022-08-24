import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao04axComponent } from './bao-cao-04ax.component';

describe('BaoCao04axComponent', () => {
  let component: BaoCao04axComponent;
  let fixture: ComponentFixture<BaoCao04axComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao04axComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao04axComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
