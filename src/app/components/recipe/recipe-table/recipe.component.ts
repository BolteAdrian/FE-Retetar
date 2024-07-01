import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  isLoading: boolean = true;
  userRole!: string | null;
  displayedColumns: string[] = [
    'id',
    'picture',
    'name',
    'category',
    'shortDescription',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  categoryId: number = Number(this.route.snapshot.paramMap.get('id'));
  categoryName: string | null = this.route.snapshot.paramMap.get('category');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getRecipes();
    this.userRole = this.authService.getUserRole();
  }

  getRecipes() {
    this.isLoading = true;
    this.recipeService.getRecipesByCategory(this.categoryId).subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.recipes.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error: any) => {
        console.error(error);
        this.isLoading = false;
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

  goBack() {
    this.router.navigate(['/category/1']);
  }
}
