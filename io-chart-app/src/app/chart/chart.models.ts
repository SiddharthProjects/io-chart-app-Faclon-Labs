export type ChartType = 'line' | 'column' | 'pie';

export interface SeriesItem {
  name: string;
  value: number;
  color: string;
}

export interface ChartOptions {
  type: ChartType;
  title: string;
  series: SeriesItem[];
}
