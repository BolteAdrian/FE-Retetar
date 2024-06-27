import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IngredientQuantityModalComponent } from '../ingredient-quantity-modal/ingredient-quantity-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { IIngredintQuantity } from 'src/app/models/IIngredientQuantity';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ISearchOptions } from 'src/app/models/ISearchOptions';
import { DeleteModalComponent } from 'src/app/components/modal/delete-modal/delete-modal.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { EmailModalComponent } from 'src/app/components/modal/email-modal/email-modal.component';
import { CurrencyConversionService } from 'src/app/services/currency-conversion/currency-conversion.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ingredient-quantity-table',
  templateUrl: './ingredient-quantity-table.component.html',
  styleUrls: ['./ingredient-quantity-table.component.scss'],
})
export class IngredientQuantityTableComponent {
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
    'amount',
    'unit',
    'price',
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
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private currencyConversionService: CurrencyConversionService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getIngredientQuantities();
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

  isExpiringSoon(expirationDateString: string): boolean {
    const expirationDate = new Date(expirationDateString);
    const today = new Date();

    // Calculate the date exactly 7 days from today
    const sevenDaysAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Check if expirationDate is after today and on or before sevenDaysAhead
    return expirationDate > today && expirationDate <= sevenDaysAhead;
  }

  isExpired(expirationDateString: string): boolean {
    const expirationDate = new Date(expirationDateString);
    const today = new Date();
    return expirationDate < today;
  }

  convertPrice(value: number, fromCurrency: string): number {
    return this.currencyConversionService.convertPrice(value, fromCurrency);
  }

  getIngredientQuantities() {
    this.isLoading = true;
    if (this.ingredientId) {
      this.ingredientService.getAllQuantities(this.ingredientId).subscribe(
        (response: any) => {
          this.dataSource = new MatTableDataSource(
            response.ingredientQuantities.result
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        (error: any) => {
          console.error(error);
          this.isLoading = false;
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

  importFromExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData: IIngredintQuantity[] = XLSX.utils.sheet_to_json(
          worksheet,
          { raw: true }
        );

        const modifiedJsonData = jsonData.map((item: any) => {
          const { id, ...rest } = item;
          return { ...rest, ingredientId: this.ingredientId };
        });

        this.ingredientService
          .importIngredientQuantities(modifiedJsonData)
          .subscribe(
            (response: any) => {
              this.translate
                .get('NOTIFY.QUANTITY.CREATE.SUCCESS')
                .subscribe((res: string) => {
                  this.notificationsService.success(res, '', {
                    timeOut: 5000,
                  });
                });

              this.getIngredientQuantities();
              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.translate
                .get('NOTIFY.QUANTITY.CREATE.FAILED')
                .subscribe((res: string) => {
                  this.notificationsService.error(res, '', {
                    timeOut: 5000,
                  });
                });
            }
          );
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
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
              this.translate
                .get('NOTIFY.QUANTITY.CREATE.SUCCESS')
                .subscribe((res: string) => {
                  this.notificationsService.success(res, '', {
                    timeOut: 5000,
                  });
                });

              this.getIngredientQuantities();
              this.dataSource._updateChangeSubscription();
              this.cdr.detectChanges();
            },
            (error: any) => {
              this.translate
                .get('NOTIFY.QUANTITY.CREATE.FAILED')
                .subscribe((res: string) => {
                  this.notificationsService.error(res, '', {
                    timeOut: 5000,
                  });
                });
            }
          );
        } else {
          this.ingredientService
            .updateIngredientQuantities(data.id, result)
            .subscribe(
              (response: any) => {
                this.translate
                  .get('NOTIFY.QUANTITY.UPDATE.SUCCESS')
                  .subscribe((res: string) => {
                    this.notificationsService.success(res, '', {
                      timeOut: 5000,
                    });
                  });

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
                this.translate
                  .get('NOTIFY.QUANTITY.UPDATE.FAILED')
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

  openDeleteConfirmation(quantityId: number): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: IIngredintQuantity) => {
      if (result) {
        this.ingredientService.deleteIngredientQuantities(quantityId).subscribe(
          (response: any) => {
            this.translate
              .get('NOTIFY.QUANTITY.REMOVE.SUCCESS')
              .subscribe((res: string) => {
                this.notificationsService.success(res, '', {
                  timeOut: 5000,
                });
              });

            const quantities = this.dataSource.data.filter(
              (quantity) => quantity.id !== quantityId
            );
            this.dataSource.data = quantities;
          },
          (error: any) => {
            this.translate
              .get('NOTIFY.QUANTITY.REMOVE.FAILED')
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
