import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTongCucComponent } from './main-tong-cuc.component';

describe('MainTongCucComponent', () => {
  let component: MainTongCucComponent;
  let fixture: ComponentFixture<MainTongCucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTongCucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTongCucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
