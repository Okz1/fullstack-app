import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  public isRoot: boolean;
  public modal: MaterialInstance;
  public pending: boolean = false;
  private oSub: Subscription;
  @ViewChild('modal') modalRef: ElementRef;

  constructor(private router: Router,
              private order: OrderService,
              private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    })
  }

  public openModal() {
    this.modal.open();
  }

  public cancel() {
    this.modal.close();
  }

  public submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map((item) => {
        delete item._id;
        return item;
      })
    };
    this.oSub = this.ordersService.create(order)
      .subscribe(newOrder => {
          MaterialService.toast(`Order ${newOrder.order} was add`);
          this.order.clear();
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        () => {
          this.modal.close();
          this.pending = false;
        }
      );
  }

  public removePosition(item: OrderPosition) {
    this.order.remove(item)
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
}