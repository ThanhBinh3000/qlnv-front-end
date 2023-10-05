import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhMucCongCuDungCuComponent } from './danh-muc-cong-cu-dung-cu.component';

describe('DanhMucCongCuDungCuComponent', () => {
  let component: DanhMucCongCuDungCuComponent;
  let fixture: ComponentFixture<DanhMucCongCuDungCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhMucCongCuDungCuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhMucCongCuDungCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
