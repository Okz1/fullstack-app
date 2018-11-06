import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/index";
import {AnalyticsPage, OverviwePage} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {
  }

  getOverview(): Observable<OverviwePage> {
    return this.http.get<OverviwePage>(`/api/analytics/overview`)
  }

  getAnalytics(): Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>(`/api/analytics/analytics`)
  }
}
