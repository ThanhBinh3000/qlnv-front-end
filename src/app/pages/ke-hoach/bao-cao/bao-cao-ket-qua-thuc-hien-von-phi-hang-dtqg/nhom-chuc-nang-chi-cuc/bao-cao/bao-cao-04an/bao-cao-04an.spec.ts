import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCao04anComponent } from './bao-cao-04an.component';

describe('BaoCao04anComponent', () => {
  let component: BaoCao04anComponent;
  let fixture: ComponentFixture<BaoCao04anComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCao04anComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCao04anComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
