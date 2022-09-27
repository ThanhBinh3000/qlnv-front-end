import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhSuaChuaComponent } from './quyet-dinh-sua-chua.component';

describe('QuyetDinhSuaChuaComponent', () => {
  let component: QuyetDinhSuaChuaComponent;
  let fixture: ComponentFixture<QuyetDinhSuaChuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhSuaChuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhSuaChuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
