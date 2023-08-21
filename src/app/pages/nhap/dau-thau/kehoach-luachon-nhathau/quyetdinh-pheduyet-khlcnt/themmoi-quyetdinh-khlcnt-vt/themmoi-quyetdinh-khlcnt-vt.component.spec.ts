import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiQuyetdinhKhlcntVtComponent } from './themmoi-quyetdinh-khlcnt-vt.component';

describe('ThemmoiQuyetdinhKhlcntVtComponent', () => {
  let component: ThemmoiQuyetdinhKhlcntVtComponent;
  let fixture: ComponentFixture<ThemmoiQuyetdinhKhlcntVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiQuyetdinhKhlcntVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiQuyetdinhKhlcntVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
