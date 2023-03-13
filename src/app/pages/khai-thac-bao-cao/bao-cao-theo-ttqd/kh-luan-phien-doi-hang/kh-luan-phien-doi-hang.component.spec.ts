import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhLuanPhienDoiHangComponent } from './kh-luan-phien-doi-hang.component';

describe('KhLuanPhienDoiHangComponent', () => {
  let component: KhLuanPhienDoiHangComponent;
  let fixture: ComponentFixture<KhLuanPhienDoiHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhLuanPhienDoiHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhLuanPhienDoiHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
