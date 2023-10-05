import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopKhnkComponent } from './tong-hop-khnk.component';

describe('TongHopKhnkComponent', () => {
  let component: TongHopKhnkComponent;
  let fixture: ComponentFixture<TongHopKhnkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopKhnkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopKhnkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
