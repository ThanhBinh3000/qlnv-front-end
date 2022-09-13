import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeHoachComponent } from './ke-hoach.component';

describe('KeHoachComponent', () => {
  let component: KeHoachComponent;
  let fixture: ComponentFixture<KeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
