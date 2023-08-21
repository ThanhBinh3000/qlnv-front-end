import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPhanBoHdVtComponent } from './dialog-phan-bo-hd-vt.component';

describe('DialogPhanBoHdVtComponent', () => {
  let component: DialogPhanBoHdVtComponent;
  let fixture: ComponentFixture<DialogPhanBoHdVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPhanBoHdVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPhanBoHdVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
