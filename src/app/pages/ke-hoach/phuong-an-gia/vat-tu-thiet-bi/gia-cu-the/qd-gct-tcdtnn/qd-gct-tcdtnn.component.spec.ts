import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QdGctTcdtnnComponent } from './qd-gct-tcdtnn.component';

describe('QdGctTcdtnnComponent', () => {
  let component: QdGctTcdtnnComponent;
  let fixture: ComponentFixture<QdGctTcdtnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QdGctTcdtnnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QdGctTcdtnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
