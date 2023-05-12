import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiSlGtriHangDtqgComponent } from './dialog-them-moi-sl-gtri-hang-dtqg.component';

describe('DialogThemMoiSlGtriHangDtqgComponent', () => {
  let component: DialogThemMoiSlGtriHangDtqgComponent;
  let fixture: ComponentFixture<DialogThemMoiSlGtriHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiSlGtriHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogThemMoiSlGtriHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
