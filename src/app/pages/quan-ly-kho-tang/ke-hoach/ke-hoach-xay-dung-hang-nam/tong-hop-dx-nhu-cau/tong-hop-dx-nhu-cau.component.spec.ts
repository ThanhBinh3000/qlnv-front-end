import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDxNhuCauComponent } from './tong-hop-dx-nhu-cau.component';

describe('TongHopDxNhuCauComponent', () => {
  let component: TongHopDxNhuCauComponent;
  let fixture: ComponentFixture<TongHopDxNhuCauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDxNhuCauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDxNhuCauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
