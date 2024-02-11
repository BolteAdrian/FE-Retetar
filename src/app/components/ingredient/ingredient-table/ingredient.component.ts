import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';
import { Router } from '@angular/router';
import { DeleteModalComponent } from '../../modal/delete-modal/delete-modal.component';
import { IIngredint } from 'src/app/models/IIngredint';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent {
  displayedColumns: string[] = [
    'id',
    'picture',
    'name',
    'category',
    'shortDescription',
    'actions',
  ];
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
        console.log(response.ingredients);
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

    dialogRef.afterClosed().subscribe((result: IIngredint) => {
      if (result) {
        if (mode == 'add') {
          this.ingredientService.addIngredient(result).subscribe(
            (response: any) => {
              // Logică pentru gestionarea răspunsului cu succes de la serviciu.
              console.log('Ingredient adăugată cu succes:', response);
              location.reload();
            },
            (error: any) => {
              // Logică pentru gestionarea erorii de la serviciu.
              console.error('Eroare în timpul adăugării categoriei:', error);
              // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
            }
          );
        } else {
          this.ingredientService.updateIngredient(data.id, result).subscribe(
            (response: any) => {
              // Logică pentru gestionarea răspunsului cu succes de la serviciu.
              console.log('Ingredient modificată cu succes:', response);
              location.reload();
            },
            (error: any) => {
              // Logică pentru gestionarea erorii de la serviciu.
              console.error(
                'Eroare în timpul modificării ingredientului:',
                error
              );
              // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
            }
          );
        }
      }
    });
  }

  openDeleteConfirmation(categoryId: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User confirmed delete, perform your delete logic here
        this.ingredientService.deleteIngredient(categoryId).subscribe(
          (response: any) => {
            // Logică pentru gestionarea răspunsului cu succes de la serviciu.
            console.log('Ingredient stearsă cu succes:', response);
            location.reload();
          },
          (error: any) => {
            // Logică pentru gestionarea erorii de la serviciu.
            console.error('Eroare în timpul stergerii ingredientului:', error);
            // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
          }
        );
      }
    });
  }

  goToIngredientQuantityManagement(): void {
    this.router.navigateByUrl('/ingredient/quantity');
  }

  goToIngredientQuantities(ingredientId: string): void {
    this.router.navigateByUrl('/ingredient/' + ingredientId + '/quantity');
  }

  goToCategoryManagement(type: string) {
    this.router.navigateByUrl('/category/' + type);
  }
}
