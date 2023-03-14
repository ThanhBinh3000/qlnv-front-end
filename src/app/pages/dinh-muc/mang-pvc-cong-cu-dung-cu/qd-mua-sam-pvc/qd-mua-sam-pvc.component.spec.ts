import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QdMuaSamPvcComponent } from './qd-mua-sam-pvc.component';

describe('QdMuaSamPvcComponent', () => {
  let component: QdMuaSamPvcComponent;
  let fixture: ComponentFixture<QdMuaSamPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QdMuaSamPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QdMuaSamPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
