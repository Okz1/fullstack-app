import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') private floatingRef: ElementRef;
  public links = [
    {url: '/overview', name: 'Огляд'},
    {url: '/analytics', name: 'Аналітика'},
    {url: '/history', name: 'Історія'},
    {url: '/order', name: 'Добавити замовлення '},
    {url: '/categories', name: 'Асортемент'},
  ];

  constructor(private auth: AuthService) {
  }

  public logOut(event: Event): void {
    event.preventDefault();
    this.auth.logOut();
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }
}
