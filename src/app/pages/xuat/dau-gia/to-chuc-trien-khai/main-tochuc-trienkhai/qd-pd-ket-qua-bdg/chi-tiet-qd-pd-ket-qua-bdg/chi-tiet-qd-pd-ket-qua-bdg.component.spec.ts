import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietQdPdKetQuaBdgComponent } from './chi-tiet-qd-pd-ket-qua-bdg.component';

describe('ChiTietQdPdKetQuaBdgComponent', () => {
  let component: ChiTietQdPdKetQuaBdgComponent;
  let fixture: ComponentFixture<ChiTietQdPdKetQuaBdgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietQdPdKetQuaBdgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietQdPdKetQuaBdgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
