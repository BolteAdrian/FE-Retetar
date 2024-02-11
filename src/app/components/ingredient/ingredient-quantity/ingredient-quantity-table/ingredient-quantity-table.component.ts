import { Component, ViewChild } from '@angular/core';
import { IngredientQuantityModalComponent } from '../ingredient-quantity-modal/ingredient-quantity-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IIngredintQuantity } from 'src/app/models/IIngredientQuantity';
import { ActivatedRoute } from '@angular/router';

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
  idIngredient: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.idIngredient = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    if (this.idIngredient) {
      this.ingredientService.getAllQuantities(this.idIngredient).subscribe(
        (response: any) => {
          this.dataSource = new MatTableDataSource(
            response.ingredientQuantities.result
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      this.ingredientService.getAllIngredientQuantitiesPaginated().subscribe(
        (response: any) => {
          this.dataSource = new MatTableDataSource(
            response.ingredientQuantities
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
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
      data: { mode, ingredientQuantity: data, idIngredient: this.idIngredient },
    });

    dialogRef.afterClosed().subscribe((result: IIngredintQuantity) => {
      if (result) {
        // Dacă utilizatorul a apăsat "Save" în modal, poți face ceva cu datele salvate.
        console.log(result);

        // În cazul adăugării sau editării, poți actualiza lista de categorii.
        if (mode == 'add') {
          this.ingredientService.addIngredientQuantities(result).subscribe(
            (response: any) => {
              // Logică pentru gestionarea răspunsului cu succes de la serviciu.
              console.log('Cantitate adăugată cu succes:', response);
              location.reload();
              // Update local data instead of reloading the page
              // this.ingredientService.updateLocalData(response); // Modify this line based on your service
            },
            (error: any) => {
              // Logică pentru gestionarea erorii de la serviciu.
              console.error('Eroare în timpul adăugării cantitatii:', error);
              // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
            }
          );
        } else {
          this.ingredientService
            .updateIngredientQuantities(data.id, result)
            .subscribe(
              (response: any) => {
                // Logică pentru gestionarea răspunsului cu succes de la serviciu.
                console.log('Cantitate modificată cu succes:', response);
                location.reload();
                // Update local data instead of reloading the page
                // this.ingredientService.updateLocalData(response); // Modify this line based on your service
              },
              (error: any) => {
                // Logică pentru gestionarea erorii de la serviciu.
                console.error(
                  'Eroare în timpul modificării cantitatii:',
                  error
                );
                // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
              }
            );
        }
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
