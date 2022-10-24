import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopNhuCauChiNsnn3NamComponent } from './tong-hop-nhu-cau-chi-nsnn-3-nam.component';

describe('TongHopNhuCauChiNsnn3NamComponent', () => {
  let component: TongHopNhuCauChiNsnn3NamComponent;
  let fixture: ComponentFixture<TongHopNhuCauChiNsnn3NamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopNhuCauChiNsnn3NamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopNhuCauChiNsnn3NamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
