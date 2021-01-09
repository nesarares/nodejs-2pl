import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  email: string;
  password: string;

  error: any;
  isLoading = false;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async login() {
    try {
      this.isLoading = true;
      this.error = null;
      await this.authService.login(this.email, this.password);
    } catch (error) {
      console.error(error);
      this.error = error;
    } finally {
      this.isLoading = false;
    }
  }

}
