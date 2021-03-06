import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../shared/services/positions.service";
import {Observable} from "rxjs";
import {Position} from "../../shared/interfaces";
import {map, switchMap} from "rxjs/internal/operators";
import {OrderService} from "../order.service";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {
  positions$: Observable<Position[]>;

  constructor(private route: ActivatedRoute,
              private positionService: PositionsService,
              private orderService: OrderService) {
  }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.positionService.fetch(params['id'])
        }),
        map((position: Position[]) => {
          return position.map(position => {
            position.quantity = 1;
            return position;
          })
        })
      )
  }

  public addToOrder(position: Position) {
    this.orderService.add(position);
    MaterialService.toast(`Add x${position.quantity}`)
  }
}
