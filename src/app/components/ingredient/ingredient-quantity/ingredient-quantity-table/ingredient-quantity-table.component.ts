import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IngredientQuantityModalComponent } from '../ingredient-quantity-modal/ingredient-quantity-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IIngredintQuantity } from 'src/app/models/IIngredientQuantity';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';

@Component({
  selector: 'app-ingredient-quantity-table',
  templateUrl: './ingredient-quantity-table.component.html',
  styleUrls: ['./ingredient-quantity-table.component.scss'],
})
export class IngredientQuantityTableComponent {
  options: ISearchOptions = {
    pageNumber: 1,
    pageSize: 5,
    searchTerm: '',
    SortOrder: 0,
    SortField: 'Name',
  };
  displayedColumns: string[] = [
    'id',
    'amount',
    'unit',
    'expiringDate',
    'dateOfPurchase',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  ingredientId: number = Number(this.route.snapshot.paramMap.get('id'));
  ingredintName: string | null = this.route.snapshot.paramMap.get('ingredient');
  categoryId: number = Number(this.route.snapshot.paramMap.get('categoryId'));
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getIngredientQuantities();
  }

  getIngredientQuantities() {
    if (this.ingredientId) {
      this.ingredientService.getAllQuantities(this.ingredientId).subscribe(
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
      this.ingredientService
        .getAllIngredientQuantitiesPaginated(this.options)
        .subscribe(
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
      data: { mode, ingredientQuantity: data, ingredientId: this.ingredientId },
    });

    dialogRef.afterClosed().subscribe((result: IIngredintQuantity) => {
      if (result) {
        if (mode == 'add') {
          this.ingredientService.addIngredientQuantities(result).subscribe(
            (response: any) => {
              this.notificationsService.success(
                'Success',
                'The quantity was added succcesfully',
                {
                  timeOut: 5000,
                }
              );
              this.getIngredientQuantities();
              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.notificationsService.error(error.status, error.message, {
                timeOut: 5000,
              });
            }
          );
        } else {
          this.ingredientService
            .updateIngredientQuantities(data.id, result)
            .subscribe(
              (response: any) => {
                this.notificationsService.success(
                  response.status,
                  response.message,
                  {
                    timeOut: 5000,
                  }
                );
                result.id = data.id;

                const index = this.dataSource.data.findIndex(
                  (item: any) => item.id === data.id
                );
                if (index !== -1) {
                  this.dataSource.data[index] = result;
                }

                this.dataSource._updateChangeSubscription();
                this.cdr.detectChanges();
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

  openDeleteConfirmation(quantityId: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: IIngredintQuantity) => {
      if (result) {
        this.ingredientService.deleteIngredientQuantities(quantityId).subscribe(
          (response: any) => {
            this.notificationsService.success(
              response.status,
              response.message,
              {
                timeOut: 5000,
              }
            );

            const quantities = this.dataSource.data.filter(
              (quantity) => quantity.id !== quantityId
            );
            this.dataSource.data = quantities;
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

  goBack() {
    this.router.navigate(['/ingredient/' + this.categoryId]);
  }
}
