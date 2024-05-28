import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category-table/category.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RecipeComponent } from './components/recipe/recipe-table/recipe.component';
import { IngredientComponent } from './components/ingredient/ingredient-table/ingredient.component';
import { RecipeDetailsComponent } from './components/recipe/recipe-details/recipe-details.component';
import { AuthGuard } from './components/auth/auth.guard';
import { RecipeFormComponent } from './components/recipe/recipe-form/recipe-form.component';
import { IngredientQuantityTableComponent } from './components/ingredient/ingredient-quantity/ingredient-quantity-table/ingredient-quantity-table.component';
import { Page404Component } from './components/page404/page404.component';
import { PreparedRecipeHistoryComponent } from './components/prepared-recipe-history/prepared-recipe-history.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'category/:type',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ingredient/:category/:id',
    component: IngredientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ingredient/:categoryId/:id/:ingredient',
    component: IngredientQuantityTableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ingredient/quantity',
    component: IngredientQuantityTableComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe/:category/:id',
    component: RecipeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-recipe',
    component: RecipeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-recipe/:id',
    component: RecipeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'prepared-recipe-history',
    component: PreparedRecipeHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:email/:token', component: ResetPasswordComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
