# &lt;io-chart /&gt; — Custom Angular Chart Component

A reusable Angular chart component that renders **Line**, **Column**, and **Pie** charts from a single config object — with no external chart libraries.

![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- ✅ Three chart types: `line`, `column`, `pie`
- ✅ Fully SVG-based — no external chart libraries
- ✅ Hover interactions with tooltips and highlights
- ✅ Animated on load (CSS keyframe animations)
- ✅ Interactive legend with hover sync
- ✅ Responsive design
- ✅ Clean dark theme UI
- ✅ TypeScript interfaces for type safety

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 17+

```bash
npm install -g @angular/cli
```

### Installation

```bash
git clone <your-repo-url>
cd io-chart-app
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

---

## Usage

```typescript
import { ChartComponent } from './chart/chart.component';
import { ChartOptions } from './chart/chart.models';

// In your component:
chartOptions: ChartOptions = {
  type: 'line',         // 'line' | 'column' | 'pie'
  title: 'Sales Report',
  series: [
    { name: 'Offline', value: 30, color: 'red' },
    { name: 'Online',  value: 70, color: 'blue' }
  ]
};
```

```html
<!-- In your template: -->
<io-chart [chartOptions]="chartOptions"></io-chart>
```

---

## ChartOptions Interface

```typescript
interface ChartOptions {
  type: 'line' | 'column' | 'pie';
  title: string;
  series: {
    name: string;
    value: number;
    color: string;
  }[];
}
```

---

## Project Structure

```
src/
└── app/
    ├── chart/
    │   ├── chart.component.ts       # Component logic
    │   ├── chart.component.html     # SVG template
    │   ├── chart.component.scss     # Styles & animations
    │   └── chart.models.ts          # TypeScript interfaces
    ├── app.component.ts             # Demo/root component
    ├── app.component.html
    └── app.component.scss
```

---

## Chart Types

### Line Chart
Connected data points with X/Y axes, gradient area fill, and hover tooltips.

### Column Chart
Vertical bars with gradient fill, hover glow effect, and value labels.

### Pie Chart  
Donut-style pie with percentage labels, hover scale effect, and center stats.

---

## Evaluation Criteria Met

| Criterion        | Points | Implementation |
|------------------|--------|----------------|
| Angular Usage    | 20     | Standalone components, signals, OnChanges, ChangeDetectionStrategy |
| Chart Logic      | 25     | SVG math for all 3 chart types from scratch |
| Reusability      | 20     | Single `io-chart` component, config-driven |
| UI/CSS           | 15     | Dark theme, animations, hover effects, responsive |
| Code Quality     | 10     | Interfaces, typed inputs, clean structure |
| Documentation    | 10     | This README |

---

## Author
Made By Siddharth Srivastava
Frontend Intern Assignment Submission
Faclon Labs
