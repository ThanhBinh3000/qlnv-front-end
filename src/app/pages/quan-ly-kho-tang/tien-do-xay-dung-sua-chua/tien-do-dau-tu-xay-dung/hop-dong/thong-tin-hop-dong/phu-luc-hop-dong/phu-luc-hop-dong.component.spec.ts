import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuLucHopDongComponent } from './phu-luc-hop-dong.component';

describe('PhuLucHopDongComponent', () => {
  let component: PhuLucHopDongComponent;
  let fixture: ComponentFixture<PhuLucHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhuLucHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLucHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
