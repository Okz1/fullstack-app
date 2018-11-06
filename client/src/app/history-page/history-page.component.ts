import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs/index";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  public isFilterVisible: boolean = false;
  public tooltip: MaterialInstance;
  public offset = 0;
  public limit = STEP;
  public orders: Order[] = [];
  public loading = false;
  public reloading = false;
  public noMoreOrders = false;
  public filter: Filter = {};
  private oSub: Subscription;
  @ViewChild('tooltip') private tooltipRef: ElementRef;

  constructor(private orderService: OrdersService) {
  }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  public loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  public applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = filter;
    this.fetch();
  }

  public isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });
    this.oSub = this.orderService.fetch(params)
      .subscribe(orders => {
        this.orders = this.orders.concat(orders);
        this.loading = false;
        this.reloading = false;
        this.noMoreOrders = orders.length < STEP;
      })
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }
}
