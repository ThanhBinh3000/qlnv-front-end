import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoKqComponent } from './bao-cao-kq.component';

describe('BaoCaoKqComponent', () => {
  let component: BaoCaoKqComponent;
  let fixture: ComponentFixture<BaoCaoKqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoKqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoKqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
