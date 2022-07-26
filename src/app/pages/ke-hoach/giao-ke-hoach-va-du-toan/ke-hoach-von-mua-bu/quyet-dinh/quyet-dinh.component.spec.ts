import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhComponent } from './quyet-dinh.component';

describe('QuyetDinhComponent', () => {
  let component: QuyetDinhComponent;
  let fixture: ComponentFixture<QuyetDinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
