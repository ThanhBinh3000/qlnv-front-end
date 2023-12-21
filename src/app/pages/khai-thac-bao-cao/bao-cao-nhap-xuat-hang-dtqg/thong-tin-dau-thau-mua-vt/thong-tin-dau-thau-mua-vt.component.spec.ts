import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDauThauMuaVtComponent } from './thong-tin-dau-thau-mua-vt.component';

describe('ThongTinDauThauMuaVtComponent', () => {
  let component: ThongTinDauThauMuaVtComponent;
  let fixture: ComponentFixture<ThongTinDauThauMuaVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinDauThauMuaVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinDauThauMuaVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
