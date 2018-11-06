import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {

  public data$;
  public tapTarget: MaterialInstance;
  public yesterday: Date;
  @ViewChild('tapTarget') tapTargetRef: ElementRef;

  constructor(private anaService: AnalyticsService) {
  }

  ngOnInit() {
    this.data$ = this.anaService.getOverview();
    this.yesterday = new Date();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  public tapInfo() {
    this.tapTarget.open();
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }
}
