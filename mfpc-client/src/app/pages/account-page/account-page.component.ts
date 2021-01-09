import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@UntilDestroy()
@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  user: User;
  discountCode: string;

  error: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
      this.error = null;
      this.user = await this.authService.getMe();
    } catch (error) {
      console.error(error);
      this.error = error;
    }
  }

  async addDiscountCode() {
    try {
      this.error = null;
      await this.authService.addDiscountCode(this.discountCode);
      this.discountCode = null;
      this.loadUser();
    } catch (error) {
      console.error(error);
      this.error = error;
    }
  }
}
