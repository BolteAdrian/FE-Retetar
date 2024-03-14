import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { DeleteModalComponent } from '../../modal/delete-modal/delete-modal.component';
import { ICategory } from 'src/app/models/ICategory';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ChangeDetectorRef } from '@angular/core';
import { ISearchOptions } from 'src/app/models/ISearchOptions';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  displayedCategories: ICategory[] = [];

  dataSource: MatTableDataSource<ICategory> =
    new MatTableDataSource<ICategory>();
  pageSize: number = 9;
  pageSizeOptions: number[] = [9, 18, 27];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRecipe: boolean = false;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.isRecipe = !!this.route.snapshot.paramMap.get('type');
    this.categoryService.getCategoriesByType(this.isRecipe).subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.data.result);
        this.updateDisplayedCategories();
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    this.updateDisplayedCategories();
  }

  updateDisplayedCategories() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;

    // Actualizăm lista de categorii afișate cu datele filtrate
    this.displayedCategories = this.dataSource.filteredData.slice(
      startIndex,
      endIndex
    );
  }

  onPageChange(event: any) {
    this.getCategories(); // Reload categories based on new page
  }

  buildSearchOptions(): ISearchOptions {
    return {
      pageNumber: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize,
      searchTerm: this.dataSource.filter,
      SortOrder: 0, // Modify this according to your sorting logic
      SortField: 'name', // Modify this according to your sorting logic
    };
  }

  openOperationModal(mode: 'add' | 'edit', data: any): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: { mode, category: data, type: this.isRecipe },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (mode == 'add') {
          this.categoryService.addCategory(result).subscribe(
            (response: any) => {
              this.notificationsService.success(
                response.status,
                response.message,
                {
                  timeOut: 5000,
                }
              );
              this.getCategories();
              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.notificationsService.error(error.name, error.message, {
                timeOut: 5000,
              });
            }
          );
        } else {
          this.categoryService.updateCategory(data.id, result).subscribe(
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
              this.notificationsService.error(error.name, error.message, {
                timeOut: 5000,
              });
            }
          );
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToElements(category: ICategory): void {
    if (!this.isRecipe) {
      this.router.navigateByUrl(
        '/ingredient/' + category.name + '/' + category.id
      );
    } else {
      this.router.navigateByUrl('/recipe/' + category.name + '/' + category.id);
    }
  }

  openDeleteConfirmation(categoryId: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: ICategory) => {
      if (result) {
        this.categoryService.deleteCategory(categoryId).subscribe(
          (response: any) => {
            this.notificationsService.success(
              response.status,
              response.message,
              {
                timeOut: 5000,
              }
            );

            const categories = this.dataSource.data.filter(
              (category) => category.id !== categoryId
            );
            this.dataSource.data = categories;
          },
          (error: any) => {
            this.notificationsService.error(error.name, error.message, {
              timeOut: 5000,
            });
          }
        );
      }
    });
  }
}
