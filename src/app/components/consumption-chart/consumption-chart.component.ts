import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-consumption-chart',
  templateUrl: './consumption-chart.component.html',
  styleUrls: ['./consumption-chart.component.scss'],
})
export class ConsumptionChartComponent implements OnInit {
  @Input() dataSource: any = [];
  chart: Chart | any;
  currentYear: number = new Date().getFullYear();
  filteredData: any[] = [];
  filterValue: string = '';

  constructor() {}

  ngOnInit() {
    Chart.register(...registerables);

    this.filteredData = this.dataSource;
    this.drawChart();
  }

  // Draw Chart
  drawChart() {
    const monthlyConsumption: any = {};
    for (const data of this.filteredData) {
      const date = new Date(data.preparedRecipe.preparationDate);
      const year = date.getFullYear();
      if (year !== this.currentYear) continue;
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

    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = '';
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
                suggestedMax: 20,
              },
              x: {
                type: 'category',
              },
            },
          },
        });
      } else {
        console.error('Canvas drawing context is not available.');
      }
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

  getSortedData(recipeConsumption: any, sortedLabels: string[]): number[] {
    return sortedLabels.map((label) => recipeConsumption[label] || 0);
  }

  filterData() {
    this.filteredData = this.dataSource.filter((data: { recipeName: string }) =>
      data.recipeName.toLowerCase().includes(this.filterValue.toLowerCase())
    );
    this.updateChart();
  }

  clearFilter() {
    this.filterValue = '';
    this.filteredData = this.dataSource;
    this.updateChart();
  }

  showPreviousYear() {
    this.currentYear--;
    this.updateChart();
  }

  showNextYear() {
    this.currentYear++;
    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
      this.drawChart();
    }
  }
}
