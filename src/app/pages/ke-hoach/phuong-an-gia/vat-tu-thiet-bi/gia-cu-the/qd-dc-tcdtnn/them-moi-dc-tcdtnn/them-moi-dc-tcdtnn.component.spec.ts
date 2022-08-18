import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiDcTcdtnnComponent } from './them-moi-dc-tcdtnn.component';

describe('ThemMoiDcTcdtnnComponent', () => {
  let component: ThemMoiDcTcdtnnComponent;
  let fixture: ComponentFixture<ThemMoiDcTcdtnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiDcTcdtnnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiDcTcdtnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
