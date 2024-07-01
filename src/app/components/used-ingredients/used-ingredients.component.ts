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
import { CurrencyConversionService } from 'src/app/services/currency-conversion/currency-conversion.service';
import { EmailModalComponent } from '../modal/email-modal/email-modal.component';
import * as XLSX from 'xlsx';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';

@Component({
  selector: 'app-used-ingredients',
  templateUrl: './used-ingredients.component.html',
  styleUrls: ['./used-ingredients.component.scss'],
})
export class UsedIngredientsComponent {
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
    'quantity.usedDate',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  ingredientId: number = Number(this.route.snapshot.paramMap.get('id'));
  ingredintName: string | null = this.route.snapshot.paramMap.get('ingredient');
  categoryId: number = Number(this.route.snapshot.paramMap.get('categoryId'));
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  activeTab: any = 'tab1';
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private ingredientService: IngredientService,
    private currencyConversionService: CurrencyConversionService
  ) {}

  ngOnInit() {
    this.getHistory();
  }

  convertPrice(value: number, fromCurrency: string): number {
    return this.currencyConversionService.convertPrice(value, fromCurrency);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToXLSX(): void {
    const filename = 'ingredient_quantities.xlsx';
    const formattedData = this.dataSource.filteredData.map((item) => ({
      ingredientName: item.ingredientName,
      amount: item.quantity.amount,
      unit: item.quantity.unit,
      price: item.quantity.price,
      currency: item.quantity.currency,
      dateOfPurchase: item.quantity.dateOfPurchase,
      expiringDate: item.quantity.expiringDate,
    }));
    const filteredData = formattedData;

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
      filename
    );
  }

  exportToPDF(): void {
    const filename = 'ingredient_quantities.pdf';

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
    doc.save(filename);
  }

  getHistory(): void {
    this.ingredientService.getUsedIngredients().subscribe(
      (response: any) => {
        this.isLoading = false;

        this.dataSource = new MatTableDataSource(response.ingredients.result);

        // Set paginator and sort after data is set
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
}
