import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCucComponent } from './main-cuc.component';

describe('MainCucComponent', () => {
  let component: MainCucComponent;
  let fixture: ComponentFixture<MainCucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
