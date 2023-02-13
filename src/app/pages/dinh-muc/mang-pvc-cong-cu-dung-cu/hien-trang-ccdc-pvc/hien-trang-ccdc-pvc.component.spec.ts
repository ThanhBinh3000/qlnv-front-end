import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HienTrangCcdcPvcComponent } from './hien-trang-ccdc-pvc.component';

describe('HienTrangCcdcPvcComponent', () => {
  let component: HienTrangCcdcPvcComponent;
  let fixture: ComponentFixture<HienTrangCcdcPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HienTrangCcdcPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HienTrangCcdcPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
