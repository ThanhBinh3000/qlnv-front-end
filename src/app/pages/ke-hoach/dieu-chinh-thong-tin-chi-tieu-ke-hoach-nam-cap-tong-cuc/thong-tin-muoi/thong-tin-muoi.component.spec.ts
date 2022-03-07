import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinMuoiComponent } from './thong-tin-muoi.component';

describe('ThongTinMuoiComponent', () => {
  let component: ThongTinMuoiComponent;
  let fixture: ComponentFixture<ThongTinMuoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThongTinMuoiComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinMuoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
