import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Subscription} from "rxjs/index";
import {Chart} from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;
  public average: number;
  public pending = true;
  public aSub: Subscription;

  constructor(private anaService: AnalyticsService) {
  }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Виручка',
      color: 'rgb(255,99,132)'
    };
    const orderConfig: any = {
      label: 'Замовлення',
      color: 'rgb(54,162,235)'
    };
    this.aSub = this.anaService.getAnalytics()
      .subscribe((data: AnalyticsPage) => {
        this.average = data.average;
        gainConfig.labels = data.chart.map(item => item.label);
        gainConfig.data = data.chart.map(item => item.gain);

        orderConfig.labels = data.chart.map(item => item.label);
        orderConfig.data = data.chart.map(item => item.order);
        //******temp*******
        // gainConfig.labels.push('06.11.2018');
        // gainConfig.labels.push('07.11.2018');
        // gainConfig.labels.push('08.11.2018');
        // gainConfig.data.push(1500);
        // gainConfig.data.push(700);
        // gainConfig.data.push(1000);
        //******temp*******
        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';
        orderCtx.canvas.height = '300px';
        new Chart(gainCtx, createCharConfig(gainConfig));
        new Chart(orderCtx, createCharConfig(orderConfig));
        this.pending = false;
      })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createCharConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
