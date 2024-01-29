import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent {
  displayedColumns: string[] = ['id', 'name', 'description', 'categoryId'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    this.ingredientService.getIngredients().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.ingredients);
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

  openOperationModal(mode: 'add' | 'edit', data: any): void {
    const dialogRef = this.dialog.open(IngredientModalComponent, {
      width: '400px',
      data: { mode, category: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Dacă utilizatorul a apăsat "Save" în modal, poți face ceva cu datele salvate.
        console.log(result);
        // În cazul adăugării sau editării, poți actualiza lista de categorii.
        this.ingredientService.addIngredient(result).subscribe(
          (response: any) => {
            // Logică pentru gestionarea răspunsului cu succes de la serviciu.
            console.log('Ingredient adăugată cu succes:', response);
          },
          (error: any) => {
            // Logică pentru gestionarea erorii de la serviciu.
            console.error('Eroare în timpul adăugării ingredientului:', error);
            // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
          }
        );
      }
    });
  }

  deleteIngredient(ingredientId: number): void {
    this.ingredientService.deleteIngredient(ingredientId).subscribe(
      (response: any) => {
        // Logică pentru gestionarea răspunsului cu succes de la serviciu.
        console.log('Ingredient sters cu succes:', response);
      },
      (error: any) => {
        // Logică pentru gestionarea erorii de la serviciu.
        console.error('Eroare în timpul stergerii ingredientului:', error);
        // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
      }
    );
  }

  goToIngredientQuantityManagement(): void {
    this.router.navigateByUrl('/ingredient/quantity');
  }
}
