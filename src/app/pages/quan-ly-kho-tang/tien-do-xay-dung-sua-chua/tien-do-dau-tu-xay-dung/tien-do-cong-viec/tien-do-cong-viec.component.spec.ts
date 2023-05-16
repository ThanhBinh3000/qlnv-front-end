import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TienDoCongViecComponent } from './tien-do-cong-viec.component';

describe('TienDoCongViecComponent', () => {
  let component: TienDoCongViecComponent;
  let fixture: ComponentFixture<TienDoCongViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TienDoCongViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TienDoCongViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
