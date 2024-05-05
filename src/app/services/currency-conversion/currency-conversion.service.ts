import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConversionService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest'; // Endpoint pentru ratele de schimb
  private exchangeRates: any; // Va reține ratele de schimb
  private settings: any = NavbarComponent.settings;
  constructor(private http: HttpClient) {
    this.getExchangeRates(this.settings.value.currency).subscribe((data) => {
      this.exchangeRates = data.rates;
    });
  }

  private getExchangeRates(currency: string): Observable<any> {
    const url = `${this.apiUrl}/${currency}`;
    return this.http.get<any>(url);
  }

  convertPrice(value: number, fromCurrency: string): number {
    // Dacă ratele de schimb nu sunt încă încărcate, nu putem face conversia
    if (!this.exchangeRates) {
      throw new Error('Exchange rates not loaded yet');
    }

    // Obținem ratele de schimb pentru monedele implicate
    const fromRate = this.getRateForCurrency(fromCurrency);
    const toRate = this.getRateForCurrency(this.settings.value.currency);

    // Verificăm dacă ratele de schimb există pentru ambele monede
    if (!fromRate || !toRate) {
      throw new Error('Exchange rate not found for provided currencies');
    }

    // Convertim valoarea în moneda sursă
    const valueInBaseCurrency = value / fromRate;

    // Convertim valoarea în moneda țintă
    const convertedValue = parseFloat(
      (valueInBaseCurrency * toRate).toFixed(2)
    );
    return convertedValue;
  }

  private getRateForCurrency(currency: string): number | undefined {
    // Obținem ratele de schimb pentru moneda dată
    return this.exchangeRates[currency];
  }
}
