import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RecipeComponent } from './components/recipe/recipe-table/recipe.component';
import { IngredientComponent } from './components/ingredient/ingredient-table/ingredient.component';
import { IngredientQuantityComponent } from './components/ingredient/ingredient-quantity/ingredient-quantity.component';
import { RecipeDetailsComponent } from './components/recipe/recipe-details/recipe-details/recipe-details.component';
import { RecipeFormComponent } from './components/recipe/recipe-form/recipe-form/recipe-form.component';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'ingredient', component: IngredientComponent },
  { path: 'ingredient/:id/quantity', component: IngredientQuantityComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: 'recipe/:id', component: RecipeDetailsComponent },
  { path: 'create-recipe', component: RecipeFormComponent, canActivate: [AuthGuard],},
  //{ path: 'recipe/update/:id', component: RecipeFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
