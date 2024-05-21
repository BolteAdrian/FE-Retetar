import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-consumption-chart',
  templateUrl: './consumption-chart.component.html',
  styleUrls: ['./consumption-chart.component.scss'],
})
export class ConsumptionChartComponent implements OnInit {
  @Input() dataSource: any = [];

  // Variabile pentru grafic
  chart: any;
  currentYear: number = new Date().getFullYear(); // Anul curent afișat pe grafic

  constructor() {}

  ngOnInit() {
    // Configurăm Chart.js
    Chart.register(...registerables);

    this.drawChart();
  }

  // Desenează graficul
  drawChart() {
    // Agruparea datelor pe lună și rețetă și calculul sumei cantităților pentru fiecare combinație
    const monthlyConsumption: any = {};
    for (const data of this.dataSource) {
      const date = new Date(data.preparedRecipe.preparationDate);
      const year = date.getFullYear();
      if (year !== this.currentYear) continue; // Ignoră datele din alte ani
      const monthYear = `${date.getMonth() + 1}-${year}`;
      const recipeName = data.recipeName;
      if (!monthlyConsumption[recipeName]) {
        monthlyConsumption[recipeName] = {};
      }
      if (!monthlyConsumption[recipeName][monthYear]) {
        monthlyConsumption[recipeName][monthYear] = 0;
      }
      monthlyConsumption[recipeName][monthYear] += data.preparedRecipe.amount;
    }

    // Crearea unui nou canvas și eliminarea celui vechi
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = ''; // Elimină canvas-ul anterior
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      chartContainer.appendChild(canvas);
      const context = canvas.getContext('2d');
      if (context) {
        this.chart = new Chart(context, {
          type: 'line',
          data: {
            labels: this.getSortedLabels(monthlyConsumption),
            datasets: Object.keys(monthlyConsumption).map((recipeName) => ({
              label: recipeName,
              data: this.getSortedData(
                monthlyConsumption[recipeName],
                this.getSortedLabels(monthlyConsumption)
              ),
              fill: false,
              borderColor: this.getRandomColor(),
              tension: 0.1,
            })),
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: 20, // Maximul dorit pentru axa Y
              },
              x: {
                type: 'category',
              },
            },
          },
        });
      } else {
        console.error(
          'Contextul de desenare pentru canvas nu este disponibil.'
        );
      }
    }
  }

  // Funcție pentru a genera o culoare aleatoare pentru fiecare linie de pe grafic
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Funcție pentru a obține etichetele sortate
  getSortedLabels(monthlyConsumption: any): string[] {
    const labelsSet = new Set<string>();
    Object.values(monthlyConsumption).forEach((consumption: any) => {
      Object.keys(consumption).forEach((label) => labelsSet.add(label));
    });
    return Array.from(labelsSet)
      .sort((a, b) => {
        const [monthA, yearA] = a.split('-').map(Number);
        const [monthB, yearB] = b.split('-').map(Number);
        return yearA - yearB || monthA - monthB;
      })
      .map((label) => {
        const [month, year] = label.split('-');
        return `${month}-${year}`;
      });
  }

  // Funcție pentru a obține datele sortate pentru fiecare rețetă
  getSortedData(recipeConsumption: any, sortedLabels: string[]): number[] {
    return sortedLabels.map((label) => recipeConsumption[label] || 0);
  }

  // Arată datele pentru anul precedent
  showPreviousYear() {
    this.currentYear--;
    this.updateChart();
  }

  // Arată datele pentru anul următor
  showNextYear() {
    this.currentYear++;
    this.updateChart();
  }

  // Actualizează graficul cu datele pentru anul curent
  updateChart() {
    if (this.chart) {
      this.chart.destroy(); // Distruge graficul existent
      this.drawChart(); // Desenează un grafic nou cu datele actualizate
    }
  }
}
