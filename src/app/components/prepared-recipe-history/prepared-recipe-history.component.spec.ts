import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparedRecipeHistoryComponent } from './prepared-recipe-history.component';

describe('PreparedRecipeHistoryComponent', () => {
  let component: PreparedRecipeHistoryComponent;
  let fixture: ComponentFixture<PreparedRecipeHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreparedRecipeHistoryComponent]
    });
    fixture = TestBed.createComponent(PreparedRecipeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
