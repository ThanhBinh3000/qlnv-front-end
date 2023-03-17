import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhHinhSuDungComponent } from './tinh-hinh-su-dung.component';

describe('TinhHinhSuDungComponent', () => {
  let component: TinhHinhSuDungComponent;
  let fixture: ComponentFixture<TinhHinhSuDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinhHinhSuDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhHinhSuDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
