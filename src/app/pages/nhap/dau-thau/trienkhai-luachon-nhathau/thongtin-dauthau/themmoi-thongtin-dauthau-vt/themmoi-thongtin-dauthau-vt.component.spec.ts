import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiThongtinDauthauVtComponent } from './themmoi-thongtin-dauthau-vt.component';

describe('ThemmoiThongtinDauthauVtComponent', () => {
  let component: ThemmoiThongtinDauthauVtComponent;
  let fixture: ComponentFixture<ThemmoiThongtinDauthauVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiThongtinDauthauVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiThongtinDauthauVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
