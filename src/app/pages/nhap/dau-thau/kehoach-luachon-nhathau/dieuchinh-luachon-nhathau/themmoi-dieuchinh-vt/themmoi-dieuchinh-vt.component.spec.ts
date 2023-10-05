import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiDieuchinhVtComponent } from './themmoi-dieuchinh-vt.component';

describe('ThemmoiDieuchinhVtComponent', () => {
  let component: ThemmoiDieuchinhVtComponent;
  let fixture: ComponentFixture<ThemmoiDieuchinhVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiDieuchinhVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiDieuchinhVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
