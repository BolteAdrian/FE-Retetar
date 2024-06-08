import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import * as XLSX from 'xlsx';
import { EmailModalComponent } from '../modal/email-modal/email-modal.component';
import { CurrencyConversionService } from 'src/app/services/currency-conversion/currency-conversion.service';

@Component({
  selector: 'app-prepared-recipe-history',
  templateUrl: './prepared-recipe-history.component.html',
  styleUrls: ['./prepared-recipe-history.component.scss'],
})
export class PreparedRecipeHistoryComponent {
  isLoading: boolean = true;
  options: ISearchOptions = {
    pageNumber: 1,
    pageSize: 5,
    searchTerm: '',
    SortOrder: 0,
    SortField: 'Name',
  };
  displayedColumns: string[] = [
    'ingredientName',
    'quantity.amount',
    'quantity.unit',
    'quantity.price',
    'quantity.expiringDate',
    'quantity.dateOfPurchase',
  ];
  displayedColumns2: string[] = [
    'recipeName',
    'preparedRecipe.amount',
    'preparedRecipe.preparationDate',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSource2: MatTableDataSource<any> = new MatTableDataSource<any>();
  ingredientId: number = Number(this.route.snapshot.paramMap.get('id'));
  ingredintName: string | null = this.route.snapshot.paramMap.get('ingredient');
  categoryId: number = Number(this.route.snapshot.paramMap.get('categoryId'));
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  activeTab: any = 'tab1';
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private recipeService: RecipeService,
    private currencyConversionService: CurrencyConversionService
  ) {}

  ngOnInit() {
    this.getHistory();
  }

  convertPrice(value: number, fromCurrency: string): number {
    return this.currencyConversionService.convertPrice(value, fromCurrency);
  }

  changeTab(tab: 'tab1' | 'tab2' | 'tab3' | 'tab4') {
    this.activeTab = tab;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage(); // Reset paginator for the second table
    }
  }

  exportToCSV(): void {
    const filename = 'ingredient_quantities.csv';
    const csvData = this.convertToCSV(this.dataSource.filteredData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  convertToCSV(data: any[]): string {
    // Exclude the last two columns from the header
    const header = Object.keys(data[0]).slice(0, -2);
    const csv = data.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(',')
    );
    csv.unshift(header.join(','));
    return csv.join('\r\n');
  }

  exportToXLSX(): void {
    const filteredData = this.dataSource.filteredData.map((item) => {
      // Exclude the last two columns from each row
      const { ingredientId, ingredient, ...rest } = item;
      return rest;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveAs(
      new Blob([excelBuffer], { type: 'application/octet-stream' }),
      'ingredient_quantities.xlsx'
    );
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      html: 'table',
      columns: [
        { header: 'Id', dataKey: 'id' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Unit', dataKey: 'unit' },
        { header: 'Price/Unit', dataKey: 'price' },
        { header: 'Currency', dataKey: 'currency' },
        { header: 'Expiring Date', dataKey: 'expiringDate' },
        { header: 'Date Of Purchase', dataKey: 'dateOfPurchase' },
      ],
    });
    doc.save('ingredient_quantities.pdf');
  }

  getHistory(): void {
    this.recipeService.getPreparedRecipesAndIngredients().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(
          response.result.result.quantities
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // Duplicate data for the second table
        this.dataSource2 = new MatTableDataSource(
          response.result.result.preparedRecipes
        );
        this.dataSource2.paginator = this.paginator; // Reuse same paginator
        this.dataSource2.sort = this.sort; // Reuse same sort

        this.isLoading = false;
      },
      (error: any) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  openEmailModal() {
    const dialogRef = this.dialog.open(EmailModalComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  goBack() {
    window.history.back();
  }
}
