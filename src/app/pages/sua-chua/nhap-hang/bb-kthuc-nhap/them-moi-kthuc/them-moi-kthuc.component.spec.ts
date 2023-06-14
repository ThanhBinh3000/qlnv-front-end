import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiKthucComponent } from './them-moi-kthuc.component';

describe('ThemMoiKthucComponent', () => {
  let component: ThemMoiKthucComponent;
  let fixture: ComponentFixture<ThemMoiKthucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiKthucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiKthucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
