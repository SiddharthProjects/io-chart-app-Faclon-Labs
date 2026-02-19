import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { ChartOptions, ChartType } from './chart/chart.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeType = signal<ChartType>('line');

  readonly chartTypes: ChartType[] = ['line', 'column', 'pie'];

  readonly dataSets = [
    {
      label: 'Sales Report',
      series: [
        { name: 'Offline', value: 30, color: '#ff6b6b' },
        { name: 'Online', value: 70, color: '#4ecdc4' },
        { name: 'Mobile', value: 55, color: '#ffe66d' },
        { name: 'Direct', value: 42, color: '#a8e6cf' },
      ]
    },
    {
      label: 'Monthly Revenue',
      series: [
        { name: 'Jan', value: 85, color: '#c8ff00' },
        { name: 'Feb', value: 62, color: '#00d4ff' },
        { name: 'Mar', value: 93, color: '#ff6b9d' },
        { name: 'Apr', value: 74, color: '#ffa07a' },
        { name: 'May', value: 110, color: '#c8ff00' },
      ]
    }
  ];

  activeDataSet = signal(0);

  get chartOptions(): ChartOptions {
    const ds = this.dataSets[this.activeDataSet()];
    return {
      type: this.activeType(),
      title: ds.label,
      series: ds.series
    };
  }

  setType(type: ChartType) { this.activeType.set(type); }
  setDataSet(i: number) { this.activeDataSet.set(i); }
}
