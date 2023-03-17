import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoSuaChuaComponent } from './tien-do-sua-chua.component';

describe('TienDoSuaChuaComponent', () => {
  let component: TienDoSuaChuaComponent;
  let fixture: ComponentFixture<TienDoSuaChuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoSuaChuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoSuaChuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
