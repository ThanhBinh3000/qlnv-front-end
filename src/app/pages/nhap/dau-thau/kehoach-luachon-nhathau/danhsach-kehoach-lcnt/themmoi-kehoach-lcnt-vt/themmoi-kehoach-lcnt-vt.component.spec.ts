import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiKehoachLcntVtComponent } from './themmoi-kehoach-lcnt-vt.component';

describe('ThemmoiKehoachLcntVtComponent', () => {
  let component: ThemmoiKehoachLcntVtComponent;
  let fixture: ComponentFixture<ThemmoiKehoachLcntVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiKehoachLcntVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiKehoachLcntVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
