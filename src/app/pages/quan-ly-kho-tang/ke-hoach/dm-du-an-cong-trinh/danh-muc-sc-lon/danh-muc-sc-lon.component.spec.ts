import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhMucScLonComponent } from './danh-muc-sc-lon.component';

describe('DanhMucScLonComponent', () => {
  let component: DanhMucScLonComponent;
  let fixture: ComponentFixture<DanhMucScLonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhMucScLonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhMucScLonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
