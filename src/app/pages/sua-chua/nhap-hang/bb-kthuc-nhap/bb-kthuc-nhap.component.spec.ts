import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbKthucNhapComponent } from './bb-kthuc-nhap.component';

describe('BbKthucNhapComponent', () => {
  let component: BbKthucNhapComponent;
  let fixture: ComponentFixture<BbKthucNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbKthucNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbKthucNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
