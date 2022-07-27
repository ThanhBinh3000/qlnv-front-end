import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinBienBanHaoDoiComponent } from './thong-tin-bien-ban-hao-doi.component';

describe('ThongTinBienBanHaoDoiComponent', () => {
  let component: ThongTinBienBanHaoDoiComponent;
  let fixture: ComponentFixture<ThongTinBienBanHaoDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinBienBanHaoDoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinBienBanHaoDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
