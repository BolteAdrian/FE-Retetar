import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
    'recipeName',
    'preparedRecipe.amount',
    'preparedRecipe.preparationDate',
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
    private recipeService: RecipeService,
    private currencyConversionService: CurrencyConversionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getHistory();
  }

  ngAfterViewInit() {
    // Initially set the paginator and sort for the first tab
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  convertPrice(value: number, fromCurrency: string): number {
    return this.currencyConversionService.convertPrice(value, fromCurrency);
  }

  changeTab(tab: 'tab1' | 'tab2' | 'tab3' | 'tab4') {
    this.activeTab = tab;

    // After tab change, detect changes to update view
    this.changeDetectorRef.detectChanges();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToXLSX(): void {
    const filename = 'prepared_food.xlsx';
    const formattedData = this.dataSource.filteredData.map((item) => ({
      recipeName: item.recipeName,
      amount: item.preparedRecipe.amount,
      preparationDate: item.preparedRecipe.preparationDate,
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
    const filename = 'prepared_food.pdf';

    const doc = new jsPDF();
    autoTable(doc, {
      html: 'table',
      columns: [
        { header: 'Name', dataKey: 'name' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Date of Preparation', dataKey: 'preparationDate' },
      ],
    });
    doc.save(filename);
  }

  getHistory(): void {
    this.recipeService.getPreparedRecipesAndIngredients().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(
          response.result.result
        );

        this.isLoading = false;

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

  goBack() {
    window.history.back();
  }
}
