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
    'shortDescription',
    'actions',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isRecipe: boolean = false;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private route: ActivatedRoute
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
        // Dacă utilizatorul a apăsat "Save" în modal, poți face ceva cu datele salvate.
        console.log(result);
        // În cazul adăugării sau editării, poți actualiza lista de categorii.
        if (mode == 'add') {
          this.categoryService.addCategory(result).subscribe(
            (response: any) => {
              // Logică pentru gestionarea răspunsului cu succes de la serviciu.
              console.log('Categorie adăugată cu succes:', response);
              location.reload();
            },
            (error: any) => {
              // Logică pentru gestionarea erorii de la serviciu.
              console.error('Eroare în timpul adăugării categoriei:', error);
              // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
            }
          );
        } else {
          this.categoryService.updateCategory(data.id, result).subscribe(
            (response: any) => {
              // Logică pentru gestionarea răspunsului cu succes de la serviciu.
              console.log('Categorie modificată cu succes:', response);
              location.reload();
            },
            (error: any) => {
              // Logică pentru gestionarea erorii de la serviciu.
              console.error('Eroare în timpul modificării categoriei:', error);
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

    dialogRef.afterClosed().subscribe((result: ICategory) => {
      if (result) {
        // User confirmed delete, perform your delete logic here
        this.categoryService.deleteCategory(categoryId).subscribe(
          (response: any) => {
            // Logică pentru gestionarea răspunsului cu succes de la serviciu.
            console.log('Categorie stearsă cu succes:', response);
            location.reload();
          },
          (error: any) => {
            // Logică pentru gestionarea erorii de la serviciu.
            console.error('Eroare în timpul stergerii categoriei:', error);
            // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
          }
        );
      }
    });
  }
}
