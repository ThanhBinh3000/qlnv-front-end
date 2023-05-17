import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiepNhanHangDtqgComponent } from './tiep-nhan-hang-dtqg.component';

describe('TiepNhanHangDtqgComponent', () => {
  let component: TiepNhanHangDtqgComponent;
  let fixture: ComponentFixture<TiepNhanHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiepNhanHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiepNhanHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
