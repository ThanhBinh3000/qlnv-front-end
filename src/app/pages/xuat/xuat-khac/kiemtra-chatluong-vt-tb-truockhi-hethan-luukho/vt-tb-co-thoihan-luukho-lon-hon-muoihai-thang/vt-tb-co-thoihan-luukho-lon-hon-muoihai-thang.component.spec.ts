import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent } from './vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang.component';

describe('VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent', () => {
  let component: VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent;
  let fixture: ComponentFixture<VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VtTbCoThoihanLuukhoLonHonMuoihaiThangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
