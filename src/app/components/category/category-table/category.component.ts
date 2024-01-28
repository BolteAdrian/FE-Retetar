import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryModalComponent } from '../category-modal/category-modal/category-modal.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  displayedColumns: string[] = ['id', 'name', 'description'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource = new MatTableDataSource(response.categories);
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
        this.categoryService.addCategory(result).subscribe(
          (response) => {
            // Logică pentru gestionarea răspunsului cu succes de la serviciu.
            console.log('Categorie adăugată cu succes:', response);
          },
          (error) => {
            // Logică pentru gestionarea erorii de la serviciu.
            console.error('Eroare în timpul adăugării categoriei:', error);
            // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
          }
        );
      }
    });
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe(
      (response) => {
        // Logică pentru gestionarea răspunsului cu succes de la serviciu.
        console.log('Categorie stearsă cu succes:', response);
      },
      (error) => {
        // Logică pentru gestionarea erorii de la serviciu.
        console.error('Eroare în timpul stergerii categoriei:', error);
        // Aici poți adăuga orice logică suplimentară pentru gestionarea erorilor, cum ar fi afișarea unui mesaj de eroare către utilizator.
      }
    );
  }
}
