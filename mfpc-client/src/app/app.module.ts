import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import localeRo from '@angular/common/locales/ro';
import { registerLocaleData } from '@angular/common';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CartLineComponent } from './components/cart-line/cart-line.component';
import { ProductActionsComponent } from './components/product-actions/product-actions.component';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './components/error/error.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { ButtonSpinnerDirective } from './components/button-spinner.directive';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

registerLocaleData(localeRo);

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatInputModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ProductsPageComponent,
    ProductCardComponent,
    CartPageComponent,
    CartLineComponent,
    ProductActionsComponent,
    ErrorComponent,
    OrdersPageComponent,
    ButtonSpinnerDirective,
    LoginPageComponent,
    AccountPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ...materialModules,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ro' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
