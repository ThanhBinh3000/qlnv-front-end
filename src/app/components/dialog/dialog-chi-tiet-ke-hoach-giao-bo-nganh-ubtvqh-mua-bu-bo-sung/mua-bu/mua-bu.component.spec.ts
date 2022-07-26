import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuaBuComponent } from './mua-bu.component';

describe('MuaBuComponent', () => {
  let component: MuaBuComponent;
  let fixture: ComponentFixture<MuaBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuaBuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuaBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
