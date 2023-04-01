import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDauThauComponent } from './thong-tin-dau-thau.component';

describe('ThongTinDauThauComponent', () => {
  let component: ThongTinDauThauComponent;
  let fixture: ComponentFixture<ThongTinDauThauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinDauThauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinDauThauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
