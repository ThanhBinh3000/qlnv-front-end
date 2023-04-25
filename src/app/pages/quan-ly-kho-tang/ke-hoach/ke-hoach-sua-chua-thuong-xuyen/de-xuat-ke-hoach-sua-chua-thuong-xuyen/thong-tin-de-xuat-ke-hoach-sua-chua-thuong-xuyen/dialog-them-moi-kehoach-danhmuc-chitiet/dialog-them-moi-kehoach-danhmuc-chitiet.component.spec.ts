import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiKehoachDanhmucChitietComponent } from './dialog-them-moi-kehoach-danhmuc-chitiet.component';

describe('DialogThemMoiKehoachDanhmucChitietComponent', () => {
  let component: DialogThemMoiKehoachDanhmucChitietComponent;
  let fixture: ComponentFixture<DialogThemMoiKehoachDanhmucChitietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiKehoachDanhmucChitietComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogThemMoiKehoachDanhmucChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
