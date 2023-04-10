import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinHopDongComponent } from './thong-tin-hop-dong.component';

describe('ThongTinHopDongComponent', () => {
  let component: ThongTinHopDongComponent;
  let fixture: ComponentFixture<ThongTinHopDongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinHopDongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
