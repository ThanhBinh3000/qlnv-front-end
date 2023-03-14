import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtPhanBoPvcComponent } from './tt-phan-bo-pvc.component';

describe('TtPhanBoPvcComponent', () => {
  let component: TtPhanBoPvcComponent;
  let fixture: ComponentFixture<TtPhanBoPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TtPhanBoPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TtPhanBoPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
