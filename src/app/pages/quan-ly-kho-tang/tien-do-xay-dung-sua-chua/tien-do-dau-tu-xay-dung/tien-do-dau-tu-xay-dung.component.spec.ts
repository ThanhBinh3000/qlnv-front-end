import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoDauTuXayDungComponent } from './tien-do-dau-tu-xay-dung.component';

describe('TienDoDauTuXayDungComponent', () => {
  let component: TienDoDauTuXayDungComponent;
  let fixture: ComponentFixture<TienDoDauTuXayDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoDauTuXayDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoDauTuXayDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
