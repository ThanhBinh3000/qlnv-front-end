import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanHaoDoiComponent } from './bien-ban-hao-doi.component';

describe('BienBanHaoDoiComponent', () => {
  let component: BienBanHaoDoiComponent;
  let fixture: ComponentFixture<BienBanHaoDoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanHaoDoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanHaoDoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
