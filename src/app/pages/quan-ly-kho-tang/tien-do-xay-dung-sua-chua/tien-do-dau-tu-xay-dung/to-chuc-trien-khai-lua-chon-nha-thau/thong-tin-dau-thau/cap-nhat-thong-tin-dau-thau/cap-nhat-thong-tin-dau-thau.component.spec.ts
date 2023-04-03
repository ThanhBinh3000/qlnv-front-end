import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapNhatThongTinDauThauComponent } from './cap-nhat-thong-tin-dau-thau.component';

describe('CapNhatThongTinDauThauComponent', () => {
  let component: CapNhatThongTinDauThauComponent;
  let fixture: ComponentFixture<CapNhatThongTinDauThauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapNhatThongTinDauThauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapNhatThongTinDauThauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
