import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcMuaBuComponent } from './btc-mua-bu.component';

describe('BtcMuaBuComponent', () => {
  let component: BtcMuaBuComponent;
  let fixture: ComponentFixture<BtcMuaBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtcMuaBuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcMuaBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
