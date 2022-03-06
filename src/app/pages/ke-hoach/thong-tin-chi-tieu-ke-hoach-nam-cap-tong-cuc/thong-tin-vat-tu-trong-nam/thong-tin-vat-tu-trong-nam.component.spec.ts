import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinVatTuTrongNamComponent } from './thong-tin-vat-tu-trong-nam.component';

describe('ThongTinVatTuTrongNamComponent', () => {
  let component: ThongTinVatTuTrongNamComponent;
  let fixture: ComponentFixture<ThongTinVatTuTrongNamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinVatTuTrongNamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinVatTuTrongNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
