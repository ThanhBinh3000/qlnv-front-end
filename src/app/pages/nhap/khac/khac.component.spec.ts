import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhacComponent } from './khac.component';

describe('KhacComponent', () => {
  let component: KhacComponent;
  let fixture: ComponentFixture<KhacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
