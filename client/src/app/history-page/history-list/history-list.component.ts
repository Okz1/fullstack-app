import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {
  @Input() orders: Order[];
  @ViewChild('modal') modalRef: ElementRef;
  public selectedOrder: Order;
  private modal: MaterialInstance;

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  public selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  public closeModal() {
    this.modal.close();
  }

  public computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0)
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }
}
