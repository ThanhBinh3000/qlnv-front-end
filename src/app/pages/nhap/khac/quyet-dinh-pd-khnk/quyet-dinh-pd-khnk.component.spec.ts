import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPdKhnkComponent } from './quyet-dinh-pd-khnk.component';

describe('QuyetDinhPdKhnkComponent', () => {
  let component: QuyetDinhPdKhnkComponent;
  let fixture: ComponentFixture<QuyetDinhPdKhnkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPdKhnkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPdKhnkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
