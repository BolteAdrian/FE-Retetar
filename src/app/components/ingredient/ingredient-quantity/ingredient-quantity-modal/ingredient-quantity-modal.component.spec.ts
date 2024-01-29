import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientQuantityModalComponent } from './ingredient-quantity-modal.component';

describe('IngredientQuantityModalComponent', () => {
  let component: IngredientQuantityModalComponent;
  let fixture: ComponentFixture<IngredientQuantityModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientQuantityModalComponent]
    });
    fixture = TestBed.createComponent(IngredientQuantityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
