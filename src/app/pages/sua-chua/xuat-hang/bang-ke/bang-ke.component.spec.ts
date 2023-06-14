import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangKeComponent } from './bang-ke.component';

describe('BangKeComponent', () => {
  let component: BangKeComponent;
  let fixture: ComponentFixture<BangKeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangKeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BangKeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
