import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/internal/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  public login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`/api/auth/login`, user)
      .pipe(
        tap(({token}) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        })
      )
  }

  public setToken(token: string): void {
    this.token = token
  }

  public getToken(): string {
    return this.token;
  }

  public isAuth(): boolean {
    return !!this.token
  }

  public logOut(): void {
    this.setToken(null);
    localStorage.clear();
    this.router.navigate(['/login']).then();
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`/api/auth/register`, user)
  }
}
