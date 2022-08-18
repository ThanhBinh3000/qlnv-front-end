import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdBtcPagComponent } from './them-moi-qd-btc-pag.component';

describe('ThemMoiQdBtcPagComponent', () => {
  let component: ThemMoiQdBtcPagComponent;
  let fixture: ComponentFixture<ThemMoiQdBtcPagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdBtcPagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdBtcPagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
