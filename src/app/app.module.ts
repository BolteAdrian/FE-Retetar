import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RecipeComponent } from './components/recipe/recipe-table/recipe.component';
import { IngredientComponent } from './components/ingredient/ingredient-table/ingredient.component';
import { CategoryComponent } from './components/category/category-table/category.component';
import { FormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { RecipeDetailsComponent } from './components/recipe/recipe-details/recipe-details.component';
import { RecipeFormComponent } from './components/recipe/recipe-form/recipe-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientInterceptor } from './components/auth/http-client-interceptor';
import { MatIconModule } from '@angular/material/icon';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CategoryModalComponent } from './components/category/category-modal/category-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IngredientQuantityTableComponent } from './components/ingredient/ingredient-quantity/ingredient-quantity-table/ingredient-quantity-table.component';
import { IngredientQuantityModalComponent } from './components/ingredient/ingredient-quantity/ingredient-quantity-modal/ingredient-quantity-modal.component';
import { IngredientModalComponent } from './components/ingredient/ingredient-modal/ingredient-modal.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { JwtModule } from '@auth0/angular-jwt';
import { DeleteModalComponent } from './components/modal/delete-modal/delete-modal.component';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';
import { ChangeEmailDialogComponent } from './components/modal/change-email-dialog/change-email-dialog.component';
import { ChangePasswordDialogComponent } from './components/modal/change-password-dialog/change-password-dialog.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { Page404Component } from './components/page404/page404.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPrintModule } from 'ngx-print';
import { EmailModalComponent } from './components/modal/email-modal/email-modal.component';
import { PreparedRecipeHistoryComponent } from './components/prepared-recipe-history/prepared-recipe-history.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConsumptionChartComponent } from './components/consumption-chart/consumption-chart.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RecipeComponent,
    RegisterComponent,
    LoginComponent,
    IngredientComponent,
    CategoryComponent,
    RecipeDetailsComponent,
    RecipeFormComponent,
    CategoryModalComponent,
    IngredientQuantityTableComponent,
    IngredientQuantityModalComponent,
    IngredientModalComponent,
    DeleteModalComponent,
    ConfirmationModalComponent,
    ChangeEmailDialogComponent,
    ChangePasswordDialogComponent,
    Page404Component,
    EmailModalComponent,
    PreparedRecipeHistoryComponent,
    ConsumptionChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    EditorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    NgxPrintModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('authToken');
        },
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
