import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialDatepicker, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {


  @Output() onFilter: EventEmitter<Filter> = new EventEmitter<Filter>();
  public order: number;
  @ViewChild('start') startRef: ElementRef;
  private start: MaterialDatepicker;
  @ViewChild('end') endRef: ElementRef;
  private end: MaterialDatepicker;
  public isValid = true;

  public validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return
    }
    this.isValid = this.start.date < this.end.date;
  }


  public submitFilter() {
    const filter: Filter = {};
    if (this.order) {
      filter.order = this.order;
    }
    if (this.start.date) {
      filter.start = this.start.date;
    }
    if (this.end.date) {
      filter.end = this.end.date;
    }
    this.onFilter.emit(filter)
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicked(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatePicked(this.endRef, this.validate.bind(this));
  }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }
}
