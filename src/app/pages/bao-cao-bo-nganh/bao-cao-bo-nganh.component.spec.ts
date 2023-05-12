import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoBoNganhComponent } from './bao-cao-bo-nganh.component';

describe('BaoCaoBoNganhComponent', () => {
  let component: BaoCaoBoNganhComponent;
  let fixture: ComponentFixture<BaoCaoBoNganhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoBoNganhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoBoNganhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
