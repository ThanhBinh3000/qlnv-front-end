import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau.component';

describe('TrienkhaiLuachonNhathauComponent', () => {
  let component: TrienkhaiLuachonNhathauComponent;
  let fixture: ComponentFixture<TrienkhaiLuachonNhathauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrienkhaiLuachonNhathauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrienkhaiLuachonNhathauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
