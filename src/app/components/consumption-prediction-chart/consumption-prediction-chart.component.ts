import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RecipeService } from 'src/app/services/recipe/recipe.service';

@Component({
  selector: 'app-consumption-prediction-chart',
  templateUrl: './consumption-prediction-chart.component.html',
  styleUrls: ['./consumption-prediction-chart.component.scss'],
})
export class ConsumptionPredictionChartComponent implements OnInit {
  @Input() dataSource: any = [];
  chart: any;
  filteredDataSource: any = [];
  filterValue: string = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    Chart.register(...registerables);
    this.getData();
  }

  getData(): void {
    this.recipeService.getPrediction().subscribe((response: any) => {
      this.dataSource = response;
      this.filteredDataSource = [...this.dataSource];
      this.drawChart();
    });
  }

  drawChart() {
    const monthlyConsumption: any = {};
    for (const data of this.filteredDataSource) {
      const date = new Date(data.preparationDate);
      const year = date.getFullYear();

      const monthYear = `${date.getMonth() + 1}-${year}`;
      const recipeName = data.recipeName;
      if (!monthlyConsumption[recipeName]) {
        monthlyConsumption[recipeName] = {};
      }
      if (!monthlyConsumption[recipeName][monthYear]) {
        monthlyConsumption[recipeName][monthYear] = 0;
      }
      monthlyConsumption[recipeName][monthYear] += data.amount;
    }

    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      chartContainer.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
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
    if (this.filterValue.trim() === '') {
      this.filteredDataSource = [...this.dataSource];
    } else {
      const filterRegex = new RegExp(this.filterValue.trim(), 'i');
      this.filteredDataSource = this.dataSource.filter((data: any) =>
        filterRegex.test(data.recipeName)
      );
    }
    this.drawChart();
  }

  clearFilter() {
    this.filterValue = '';
    this.filteredDataSource = [...this.dataSource];
    this.drawChart();
  }
}
