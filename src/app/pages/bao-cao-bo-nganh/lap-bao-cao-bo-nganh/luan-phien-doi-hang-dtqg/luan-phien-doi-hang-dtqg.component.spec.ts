import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuanPhienDoiHangDtqgComponent } from './luan-phien-doi-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: LuanPhienDoiHangDtqgComponent;
  let fixture: ComponentFixture<LuanPhienDoiHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuanPhienDoiHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuanPhienDoiHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
