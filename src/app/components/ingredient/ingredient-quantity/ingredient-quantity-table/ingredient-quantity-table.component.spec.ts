import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientQuantityTableComponent } from './ingredient-quantity-table.component';

describe('IngredientQuantityTableComponent', () => {
  let component: IngredientQuantityTableComponent;
  let fixture: ComponentFixture<IngredientQuantityTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientQuantityTableComponent]
    });
    fixture = TestBed.createComponent(IngredientQuantityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
