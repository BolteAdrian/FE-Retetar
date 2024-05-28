import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionPredictionChartComponent } from './consumption-prediction-chart.component';

describe('ConsumptionPredictionChartComponent', () => {
  let component: ConsumptionPredictionChartComponent;
  let fixture: ComponentFixture<ConsumptionPredictionChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionPredictionChartComponent]
    });
    fixture = TestBed.createComponent(ConsumptionPredictionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
