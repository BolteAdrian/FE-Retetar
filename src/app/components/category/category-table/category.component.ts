import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { DeleteModalComponent } from '../../modal/delete-modal/delete-modal.component';
import { ICategory } from 'src/app/models/ICategory';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  displayedColumns: string[] = [
    'id',
    'picture',
    'name',
    'description',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRecipe: boolean = false;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.isRecipe = !!this.route.snapshot.paramMap.get('type');
    this.categoryService.getCategoriesByType(this.isRecipe).subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response.data.result);
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
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: { mode, category: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
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
              location.reload();
            },
            (error: any) => {
              this.notificationsService.error(error.status, error.message, {
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
}
