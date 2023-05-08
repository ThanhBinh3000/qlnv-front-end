import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NguonHinhThanhDtqgComponent } from './nguon-hinh-thanh-dtqg.component';

describe('NguonHinhThanhDtqgComponent', () => {
  let component: NguonHinhThanhDtqgComponent;
  let fixture: ComponentFixture<NguonHinhThanhDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NguonHinhThanhDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NguonHinhThanhDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
