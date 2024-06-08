import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ISettings } from 'src/app/models/ISettings';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConversionService {
  // Base URL for the currency exchange rate API
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest';

  // Object to hold the exchange rates
  private exchangeRates: any;

  // Reference to the settings from NavbarComponent
  private settings: ISettings = NavbarComponent.settings.value;

  /**
   * Constructor
   * Initializes the service and fetches exchange rates based on the current currency setting.
   * @param {HttpClient} http - The HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    this.getExchangeRates(this.settings.currency).subscribe((data) => {
      this.exchangeRates = data.rates;
    });
  }

  /**
   * Fetches exchange rates for a given currency.
   * @param {string} currency - The currency code for which to fetch exchange rates.
   * @returns {Observable<any>} - An observable containing the exchange rate data.
   */
  private getExchangeRates(currency: string): Observable<any> {
    const url = `${this.apiUrl}/${currency}`;
    return this.http.get<any>(url);
  }

  /**
   * Converts a value from one currency to the currency specified in settings.
   * @param {number} value - The amount to convert.
   * @param {string} fromCurrency - The source currency code.
   * @returns {number} - The converted value in the target currency.
   * @throws Will throw an error if exchange rates are not loaded or if the exchange rate for the provided currencies is not found.
   */
  convertPrice(value: number, fromCurrency: string): number {
    if (!this.exchangeRates) {
      throw new Error('Exchange rates not loaded yet');
    }

    const fromRate = this.getRateForCurrency(fromCurrency);
    const toRate = this.getRateForCurrency(this.settings.currency);

    if (!fromRate || !toRate) {
      throw new Error('Exchange rate not found for provided currencies');
    }

    const valueInBaseCurrency = value / fromRate;
    const convertedValue = parseFloat(
      (valueInBaseCurrency * toRate).toFixed(2)
    );

    return convertedValue;
  }

  /**
   * Retrieves the exchange rate for a specific currency.
   * @param {string} currency - The currency code for which to retrieve the exchange rate.
   * @returns {number | undefined} - The exchange rate for the specified currency, or undefined if not found.
   */
  private getRateForCurrency(currency: string): number | undefined {
    return this.exchangeRates[currency];
  }
}
