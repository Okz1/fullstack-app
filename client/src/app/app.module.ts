import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {AuthService} from "./shared/services/auth.service";
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {OverviewPageComponent} from './overview-page/overview-page.component';
import {AnalyticsPageComponent} from './analytics-page/analytics-page.component';
import {HistoryPageComponent} from './history-page/history-page.component';
import {OrderPageComponent} from './order-page/order-page.component';
import {CategoriesPageComponent} from './categories-page/categories-page.component';
import {CategoriesService} from "./shared/services/categories.service";
import {LoaderComponent} from './shared/component/loader/loader.component';
import {CategoriesFormComponent} from './categories-page/categories-form/categories-form.component';
import {PositionsFormComponent} from './categories-page/categories-form/positions-form/positions-form.component';
import {OrderCategoriesComponent} from './order-page/order-categories/order-categories.component';
import {OrderPositionsComponent} from './order-page/order-positions/order-positions.component';
import {HistoryFilterComponent} from "./history-page/history-filter/history-filter.component";
import {HistoryListComponent} from "./history-page/history-list/history-list.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    AnalyticsPageComponent,
    HistoryPageComponent,
    OrderPageComponent,
    CategoriesPageComponent,
    LoaderComponent,
    CategoriesFormComponent,
    PositionsFormComponent,
    OrderCategoriesComponent,
    OrderPositionsComponent,
    HistoryFilterComponent,
    HistoryListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }, CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}