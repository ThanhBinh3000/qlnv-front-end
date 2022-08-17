import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QdDcTcdtnnComponent } from './qd-dc-tcdtnn.component';

describe('QdDcTcdtnnComponent', () => {
  let component: QdDcTcdtnnComponent;
  let fixture: ComponentFixture<QdDcTcdtnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QdDcTcdtnnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QdDcTcdtnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
