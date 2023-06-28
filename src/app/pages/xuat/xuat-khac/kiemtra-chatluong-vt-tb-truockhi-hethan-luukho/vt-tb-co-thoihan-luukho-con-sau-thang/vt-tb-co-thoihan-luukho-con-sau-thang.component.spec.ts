import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtTbCoThoihanLuukhoConSauThangComponent } from './vt-tb-co-thoihan-luukho-con-sau-thang.component';

describe('VtTbCoThoihanLuukhoConSauThangComponent', () => {
  let component: VtTbCoThoihanLuukhoConSauThangComponent;
  let fixture: ComponentFixture<VtTbCoThoihanLuukhoConSauThangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtTbCoThoihanLuukhoConSauThangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VtTbCoThoihanLuukhoConSauThangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
