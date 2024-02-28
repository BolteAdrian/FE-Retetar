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
import { NotificationsService } from 'angular2-notifications';

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
    'description',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private router: Router,
    private notificationsService: NotificationsService
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
              this.notificationsService.success(
                response.status,
                response.message,
                {
                  timeOut: 5000,
                }
              );
              location.reload();
            },
            (error: any) => {
              this.notificationsService.error(error.status, error.message, {
                timeOut: 5000,
              });
            }
          );
        } else {
          this.ingredientService.updateIngredient(data.id, result).subscribe(
            (response: any) => {
              this.notificationsService.success(
                response.status,
                response.message,
                {
                  timeOut: 5000,
                }
              );
              location.reload();
            },
            (error: any) => {
              this.notificationsService.error(error.status, error.message, {
                timeOut: 5000,
              });
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
        this.ingredientService.deleteIngredient(categoryId).subscribe(
          (response: any) => {
            this.notificationsService.success(
              response.status,
              response.message,
              {
                timeOut: 5000,
              }
            );
            location.reload();
          },
          (error: any) => {
            this.notificationsService.error(error.status, error.message, {
              timeOut: 5000,
            });
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
