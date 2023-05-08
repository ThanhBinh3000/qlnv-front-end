import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapBaoCaoBoNganhComponent } from './lap-bao-cao-bo-nganh.component';

describe('LapBaoCaoBoNganhComponent', () => {
  let component: LapBaoCaoBoNganhComponent;
  let fixture: ComponentFixture<LapBaoCaoBoNganhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LapBaoCaoBoNganhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LapBaoCaoBoNganhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
