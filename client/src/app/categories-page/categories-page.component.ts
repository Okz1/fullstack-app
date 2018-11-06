import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";
import {Observable} from "rxjs/index";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit {
  public categories$: Observable<Category[]>;

  constructor(private categoryService: CategoriesService) {
  }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch();
  }

}
