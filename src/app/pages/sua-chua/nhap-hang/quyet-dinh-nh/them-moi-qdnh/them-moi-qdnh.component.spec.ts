import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiQdnhComponent } from './them-moi-qdnh.component';

describe('ThemMoiQdnhComponent', () => {
  let component: ThemMoiQdnhComponent;
  let fixture: ComponentFixture<ThemMoiQdnhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiQdnhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiQdnhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
