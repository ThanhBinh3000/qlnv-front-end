import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdxhComponent } from './them-moi-qdxh.component';

describe('ThemMoiQdxhComponent', () => {
  let component: ThemMoiQdxhComponent;
  let fixture: ComponentFixture<ThemMoiQdxhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdxhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdxhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
