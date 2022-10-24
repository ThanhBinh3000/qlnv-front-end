import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao04bComponent } from './bao-cao-04b.component';

describe('BaoCao04bComponent', () => {
  let component: BaoCao04bComponent;
  let fixture: ComponentFixture<BaoCao04bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao04bComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao04bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
