import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QdPdHsMoiThauComponent } from './qd-pd-hs-moi-thau.component';

describe('QdPdHsMoiThauComponent', () => {
  let component: QdPdHsMoiThauComponent;
  let fixture: ComponentFixture<QdPdHsMoiThauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QdPdHsMoiThauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QdPdHsMoiThauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
