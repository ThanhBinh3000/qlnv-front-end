import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopNcCucPvcComponent } from './tong-hop-nc-cuc-pvc.component';

describe('TongHopNcCucPvcComponent', () => {
  let component: TongHopNcCucPvcComponent;
  let fixture: ComponentFixture<TongHopNcCucPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopNcCucPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopNcCucPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
