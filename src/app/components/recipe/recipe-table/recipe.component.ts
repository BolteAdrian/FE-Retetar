import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'picture',
    'name',
    'shortDescription',
    'category',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.getRecipes();
  }

  getRecipes() {
    this.recipeService.getRecipes().subscribe(
      (response: any) => {
        console.log(response.recipes.result);
        this.dataSource = new MatTableDataSource(response.recipes.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToRecipeDetails(id: Number): void {
    this.router.navigateByUrl('/recipe/' + id);
  }

  goToRecipeCreate(): void {
    this.router.navigateByUrl('/create-recipe');
  }

  goToCategoryManagement(type: string) {
    this.router.navigateByUrl('/category/' + type);
  }
}
