import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedIngredientsComponent } from './used-ingredients.component';

describe('UsedIngredientsComponent', () => {
  let component: UsedIngredientsComponent;
  let fixture: ComponentFixture<UsedIngredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsedIngredientsComponent]
    });
    fixture = TestBed.createComponent(UsedIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
