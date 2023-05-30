import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanLayMauBanGiaoMauComponent } from './bien-ban-lay-mau-ban-giao-mau.component';

describe('BienBanLayMauBanGiaoMauComponent', () => {
  let component: BienBanLayMauBanGiaoMauComponent;
  let fixture: ComponentFixture<BienBanLayMauBanGiaoMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanLayMauBanGiaoMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanLayMauBanGiaoMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
