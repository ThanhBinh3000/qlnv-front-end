import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiKtraclComponent } from './them-moi-ktracl.component';

describe('ThemMoiKtraclComponent', () => {
  let component: ThemMoiKtraclComponent;
  let fixture: ComponentFixture<ThemMoiKtraclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiKtraclComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiKtraclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
