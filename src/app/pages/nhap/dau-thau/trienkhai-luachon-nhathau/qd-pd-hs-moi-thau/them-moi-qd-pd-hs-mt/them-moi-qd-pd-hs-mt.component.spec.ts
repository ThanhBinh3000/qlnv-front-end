import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdPdHsMtComponent } from './them-moi-qd-pd-hs-mt.component';

describe('ThemMoiQdPdHsMtComponent', () => {
  let component: ThemMoiQdPdHsMtComponent;
  let fixture: ComponentFixture<ThemMoiQdPdHsMtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdPdHsMtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdPdHsMtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
