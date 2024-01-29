import { Component, ViewChild } from '@angular/core';
import { IngredientQuantityModalComponent } from '../ingredient-quantity-modal/ingredient-quantity-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';

@Component({
  selector: 'app-ingredient-quantity-table',
  templateUrl: './ingredient-quantity-table.component.html',
  styleUrls: ['./ingredient-quantity-table.component.scss'],
})
export class IngredientQuantityTableComponent {
  displayedColumns: string[] = [
    'id',
    'amount',
    'unit',
    'expiringDate',
    'dateOfPurchase',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog
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
    const dialogRef = this.dialog.open(IngredientQuantityModalComponent, {
      width: '400px',
      data: { mode, category: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Dacă utilizatorul a apăsat "Save" în modal, poți face ceva cu datele salvate.
        console.log(result);
        // În cazul adăugării sau editării, poți actualiza lista de categorii.
        this.ingredientService.addIngredientQuantities(result).subscribe(
          (response: any) => {
            // Logică pentru gestionarea răspunsului cu succes de la serviciu.
            console.log('Ingredient adăugat cu succes:', response);
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
    this.ingredientService.deleteIngredientQuantities(ingredientId).subscribe(
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
}
