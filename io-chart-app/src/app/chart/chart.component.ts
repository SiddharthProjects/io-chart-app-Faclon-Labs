import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions, SeriesItem } from './chart.models';

interface PieSlice {
  item: SeriesItem;
  path: string;
  labelX: number;
  labelY: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
}

interface LinePoint {
  x: number;
  y: number;
  item: SeriesItem;
}

@Component({
  selector: 'io-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnChanges {
  @Input() chartOptions!: ChartOptions;

  // Expose Math to template
  readonly Math = Math;

  // Reactive state
  hoveredIndex = signal<number>(-1);
  animated = signal<boolean>(false);

  // SVG dimensions
  readonly svgWidth = 560;
  readonly svgHeight = 320;
  readonly padding = { top: 40, right: 30, bottom: 60, left: 60 };

  get plotWidth() { return this.svgWidth - this.padding.left - this.padding.right; }
  get plotHeight() { return this.svgHeight - this.padding.top - this.padding.bottom; }

  get series(): SeriesItem[] { return this.chartOptions?.series ?? []; }
  get title(): string { return this.chartOptions?.title ?? ''; }
  get type(): string { return this.chartOptions?.type ?? 'column'; }
  get total(): number { return this.series.reduce((s, i) => s + i.value, 0); }
  get maxValue(): number { return Math.max(...this.series.map(i => i.value), 0); }

  // Safe first color getter (avoids optional chain warning in template)
  get firstColor(): string {
    return this.series.length > 0 ? this.series[0].color : '#c8ff00';
  }

  get donutHoleR(): number {
    return Math.min(this.plotWidth, this.plotHeight) * 0.18;
  }

  // ---- Line Chart ----
  get linePoints(): LinePoint[] {
    if (!this.series.length) return [];
    const step = this.plotWidth / Math.max(this.series.length - 1, 1);
    return this.series.map((item, i) => ({
      x: this.padding.left + (this.series.length === 1 ? this.plotWidth / 2 : i * step),
      y: this.padding.top + this.plotHeight - (item.value / this.maxValue) * this.plotHeight,
      item
    }));
  }

  get linePath(): string {
    const pts = this.linePoints;
    if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  get areaPath(): string {
    const pts = this.linePoints;
    if (!pts.length) return '';
    const bottom = this.padding.top + this.plotHeight;
    return [
      `M ${pts[0].x} ${bottom}`,
      ...pts.map(p => `L ${p.x} ${p.y}`),
      `L ${pts[pts.length - 1].x} ${bottom}`,
      'Z'
    ].join(' ');
  }

  get yAxisTicks(): { y: number; label: string }[] {
    const ticks = 5;
    return Array.from({ length: ticks + 1 }, (_, i) => {
      const val = (this.maxValue * i) / ticks;
      const y = this.padding.top + this.plotHeight - (val / this.maxValue) * this.plotHeight;
      return { y, label: Math.round(val).toString() };
    });
  }

  // ---- Column Chart ----
  get columnBars(): { x: number; y: number; width: number; height: number; item: SeriesItem; index: number; gradId: string }[] {
    const barCount = this.series.length;
    const gap = 16;
    const barWidth = (this.plotWidth - gap * (barCount + 1)) / barCount;
    return this.series.map((item, i) => {
      const height = (item.value / this.maxValue) * this.plotHeight;
      return {
        x: this.padding.left + gap + i * (barWidth + gap),
        y: this.padding.top + this.plotHeight - height,
        width: barWidth,
        height,
        item,
        index: i,
        gradId: 'barGrad' + i
      };
    });
  }

  get barGradients(): { id: string; color: string }[] {
    return this.series.map((item, i) => ({ id: 'barGrad' + i, color: item.color }));
  }

  // ---- Pie Chart ----
  get pieSlices(): PieSlice[] {
    if (!this.total) return [];
    const cx = this.svgWidth / 2;
    const cy = this.svgHeight / 2;
    const r = Math.min(this.plotWidth, this.plotHeight) * 0.42;

    let angle = -Math.PI / 2;
    return this.series.map(item => {
      const portion = item.value / this.total;
      const startAngle = angle;
      const endAngle = angle + portion * 2 * Math.PI;
      const midAngle = (startAngle + endAngle) / 2;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = portion > 0.5 ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const labelR = r * 0.65;
      const labelX = cx + labelR * Math.cos(midAngle);
      const labelY = cy + labelR * Math.sin(midAngle);

      angle = endAngle;
      return { item, path, labelX, labelY, percentage: Math.round(portion * 100), startAngle, endAngle, midAngle };
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartOptions']) {
      this.hoveredIndex.set(-1);
      this.animated.set(false);
      setTimeout(() => this.animated.set(true), 50);
    }
  }

  setHovered(index: number) { this.hoveredIndex.set(index); }
  clearHovered() { this.hoveredIndex.set(-1); }
  isHovered(index: number) { return this.hoveredIndex() === index; }
  isAnyHovered() { return this.hoveredIndex() >= 0; }

  trackByIndex(index: number) { return index; }
}
