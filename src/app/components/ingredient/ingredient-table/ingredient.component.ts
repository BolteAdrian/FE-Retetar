import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IngredientModalComponent } from '../ingredient-modal/ingredient-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteModalComponent } from '../../modal/delete-modal/delete-modal.component';
import { IIngredint } from 'src/app/models/IIngredint';
import { NotificationsService } from 'angular2-notifications';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent {
  isLoading: boolean = true;
  options: ISearchOptions = {
    pageNumber: 1,
    pageSize: 5,
    searchTerm: '',
    SortOrder: 0,
    SortField: 'Name',
  };

  displayedColumns: string[] = [
    'id',
    'picture',
    'name',
    'description',
    'actions',
  ];

  categoryId: number = Number(this.route.snapshot.paramMap.get('id'));
  categoryName: string | null = this.route.snapshot.paramMap.get('category');
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private router: Router,
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients() {
    this.isLoading = true;
    this.ingredientService.getIngredientsByCategory(this.categoryId).subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.ingredients);
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

  openOperationModal(mode: 'add' | 'edit', data: any): void {
    const dialogRef = this.dialog.open(IngredientModalComponent, {
      width: '400px',
      data: { mode, ingredient: data },
    });

    dialogRef.afterClosed().subscribe((result: IIngredint) => {
      if (result) {
        result.categoryId = this.categoryId;
        if (mode == 'add') {
          this.ingredientService.addIngredient(result).subscribe(
            (response: any) => {
              this.translate
                .get('NOTIFY.INGREDIENT.CREATE.SUCCESS')
                .subscribe((res: string) => {
                  this.notificationsService.success(res, '', {
                    timeOut: 5000,
                  });
                });

              this.getIngredients();
              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.translate
                .get('NOTIFY.INGREDIENT.CREATE.FAILED')
                .subscribe((res: string) => {
                  this.notificationsService.error(res, '', {
                    timeOut: 5000,
                  });
                });
            }
          );
        } else {
          this.ingredientService.updateIngredient(data.id, result).subscribe(
            (response: any) => {
              this.translate
                .get('NOTIFY.INGREDIENT.UPDATE.SUCCESS')
                .subscribe((res: string) => {
                  this.notificationsService.success(res, '', {
                    timeOut: 5000,
                  });
                });

              const index = this.dataSource.data.findIndex(
                (item: any) => item.id === data.id
              );
              if (index !== -1) {
                if (
                  this.dataSource.data[index].categoryId === result.categoryId
                ) {
                  this.dataSource.data[index].description = result.description;
                  this.dataSource.data[index].name = result.name;
                  this.dataSource.data[index].picture = result.picture;
                } else {
                  location.reload();
                }
              }

              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.translate
                .get('NOTIFY.INGREDIENT.UPDATE.FAILED')
                .subscribe((res: string) => {
                  this.notificationsService.error(res, '', {
                    timeOut: 5000,
                  });
                });
            }
          );
        }
      }
    });
  }

  openDeleteConfirmation(ingredientId: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ingredientService.deleteIngredient(ingredientId).subscribe(
          (response: any) => {
            this.translate
              .get('NOTIFY.INGREDIENT.REMOVE.SUCCESS')
              .subscribe((res: string) => {
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });
            const ingredients = this.dataSource.data.filter(
              (ingredient) => ingredient.id !== ingredientId
            );
            this.dataSource.data = ingredients;
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.INGREDIENT.REMOVE.FAILED')
              .subscribe((res: string) => {
                this.notificationsService.error(res, '', {
                  timeOut: 5000,
                });
              });
          }
        );
      }
    });
  }

  goToIngredientQuantities(ingredient: IIngredint): void {
    this.router.navigateByUrl(
      '/ingredient/' +
        this.categoryId +
        '/' +
        ingredient.id +
        '/' +
        ingredient.name
    );
  }

  goBack() {
    this.router.navigate(['/category']);
  }
}
