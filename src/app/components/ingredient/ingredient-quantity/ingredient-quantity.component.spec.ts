import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientQuantityComponent } from './ingredient-quantity.component';

describe('IngredientQuantityComponent', () => {
  let component: IngredientQuantityComponent;
  let fixture: ComponentFixture<IngredientQuantityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientQuantityComponent]
    });
    fixture = TestBed.createComponent(IngredientQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
