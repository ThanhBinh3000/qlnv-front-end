import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoHaoHutHangDtqgComponent } from './bao-cao-hao-hut-hang-dtqg.component';

describe('BaoCaoHaoHutHangDtqgComponent', () => {
  let component: BaoCaoHaoHutHangDtqgComponent;
  let fixture: ComponentFixture<BaoCaoHaoHutHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoHaoHutHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoHaoHutHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
