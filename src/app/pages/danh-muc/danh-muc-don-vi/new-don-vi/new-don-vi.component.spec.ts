import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDonViComponent } from './new-don-vi.component';

describe('NewDonViComponent', () => {
  let component: NewDonViComponent;
  let fixture: ComponentFixture<NewDonViComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDonViComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDonViComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
