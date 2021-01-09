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

  constructor(private router: Router, private route: ActivatedRoute) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.user = user || null;
    this.userChanged();
  }

  get isLoggedIn() {
    return !!this.user;
  }

  async login(email: string, password: string) {
    this.user = {
      _id: 'user123',
      name: 'Rares',
      email: 'rares@test.com',
      points: 23,
      discountCodes: [{ _id: 'abc', code: 'MYDISC', discount: 25 }],
    };
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate([returnUrl || '/account']);
    this.userChanged();
  }

  async logout() {
    this.user = null;
    this.router.navigate(['/login']);
    this.userChanged();
  }

  userChanged() {
    if (this.user) {
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      localStorage.removeItem('user');
    }
    this.userSubject.next(this.user);
  }

  async getMe(): Promise<User> {
    return this.user;
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
