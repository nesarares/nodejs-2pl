import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
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

registerLocaleData(localeRo);

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatBadgeModule,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ...materialModules,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ro' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
