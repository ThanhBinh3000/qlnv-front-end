import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiThukhoComponent } from './themmoi-thukho.component';

describe('ThemmoiThukhoComponent', () => {
  let component: ThemmoiThukhoComponent;
  let fixture: ComponentFixture<ThemmoiThukhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiThukhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiThukhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
