import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoXayDungSuaChuaComponent } from './tien-do-xay-dung-sua-chua.component';

describe('TienDoXayDungSuaChuaComponent', () => {
  let component: TienDoXayDungSuaChuaComponent;
  let fixture: ComponentFixture<TienDoXayDungSuaChuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoXayDungSuaChuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoXayDungSuaChuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
