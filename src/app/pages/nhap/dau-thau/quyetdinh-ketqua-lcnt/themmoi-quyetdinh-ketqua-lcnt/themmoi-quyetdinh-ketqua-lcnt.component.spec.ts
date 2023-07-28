import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiQuyetdinhKetquaLcntComponent } from './themmoi-quyetdinh-ketqua-lcnt.component';

describe('ThemmoiQuyetdinhKetquaLcntComponent', () => {
  let component: ThemmoiQuyetdinhKetquaLcntComponent;
  let fixture: ComponentFixture<ThemmoiQuyetdinhKetquaLcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiQuyetdinhKetquaLcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiQuyetdinhKetquaLcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
