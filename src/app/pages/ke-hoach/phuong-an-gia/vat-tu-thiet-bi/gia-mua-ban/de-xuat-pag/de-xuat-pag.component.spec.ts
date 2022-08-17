import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatPagComponent } from './de-xuat-pag.component';

describe('DeXuatPagComponent', () => {
  let component: DeXuatPagComponent;
  let fixture: ComponentFixture<DeXuatPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatPagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
