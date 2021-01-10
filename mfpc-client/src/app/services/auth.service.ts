import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User>(null);
  public user$ = this.userSubject.asObservable();

  user: User;
  token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user = user || null;
    const token = localStorage.getItem('token');
    this.token = token || null;
    this.userChanged();
  }

  get isLoggedIn() {
    return !!this.user;
  }

  async login(email: string, password: string) {
    const response = await this.http
      .post<{ token: string; user: User }>('auth/login', { email, password })
      .toPromise();
    this.user = response.user;
    this.token = response.token;
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate([returnUrl || '/account']);
    this.userChanged();
  }

  async logout() {
    try {
      await this.http.post('auth/logout', {}).toPromise();
    } catch (error) {
    } finally {
      this.user = null;
      this.token = null;
      this.router.navigate(['/login']);
      this.userChanged();
    }
  }

  userChanged() {
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('token', this.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.userSubject.next(this.user);
  }

  async getMe(): Promise<User> {
    return this.http.get<User>('auth/me').toPromise();
  }

  async addDiscountCode(code: string) {
    code = code.toUpperCase();
    if (!this.user.discountCodes) {
      this.user.discountCodes = [];
    }

    this.user.discountCodes.push({
      _id: 'abc',
      code,
      discount: 10,
    });
  }
}
