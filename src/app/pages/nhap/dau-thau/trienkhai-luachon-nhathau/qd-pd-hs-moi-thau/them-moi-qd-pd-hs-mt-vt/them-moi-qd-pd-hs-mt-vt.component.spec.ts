import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdPdHsMtVtComponent } from './them-moi-qd-pd-hs-mt-vt.component';

describe('ThemMoiQdPdHsMtVtComponent', () => {
  let component: ThemMoiQdPdHsMtVtComponent;
  let fixture: ComponentFixture<ThemMoiQdPdHsMtVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdPdHsMtVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdPdHsMtVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
