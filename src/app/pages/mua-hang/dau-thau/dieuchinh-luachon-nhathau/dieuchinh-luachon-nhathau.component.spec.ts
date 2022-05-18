import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieuchinhLuachonNhathauComponent } from './dieuchinh-luachon-nhathau.component';

describe('DieuchinhLuachonNhathauComponent', () => {
  let component: DieuchinhLuachonNhathauComponent;
  let fixture: ComponentFixture<DieuchinhLuachonNhathauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieuchinhLuachonNhathauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DieuchinhLuachonNhathauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
