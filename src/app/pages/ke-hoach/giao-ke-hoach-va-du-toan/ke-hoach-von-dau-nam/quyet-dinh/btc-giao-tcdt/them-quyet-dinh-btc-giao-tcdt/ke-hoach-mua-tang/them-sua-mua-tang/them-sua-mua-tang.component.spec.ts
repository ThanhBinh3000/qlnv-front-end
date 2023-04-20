import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemSuaMuaTangComponent } from './them-sua-mua-tang.component';

describe('ThemSuaMuaTangComponent', () => {
  let component: ThemSuaMuaTangComponent;
  let fixture: ComponentFixture<ThemSuaMuaTangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemSuaMuaTangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemSuaMuaTangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
