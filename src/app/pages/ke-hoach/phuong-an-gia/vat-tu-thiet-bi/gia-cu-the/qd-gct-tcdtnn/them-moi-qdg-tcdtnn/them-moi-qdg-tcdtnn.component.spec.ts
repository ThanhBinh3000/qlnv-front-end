import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdgTcdtnnComponent } from './them-moi-qdg-tcdtnn.component';

describe('ThemMoiQdgTcdtnnComponent', () => {
  let component: ThemMoiQdgTcdtnnComponent;
  let fixture: ComponentFixture<ThemMoiQdgTcdtnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdgTcdtnnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdgTcdtnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
