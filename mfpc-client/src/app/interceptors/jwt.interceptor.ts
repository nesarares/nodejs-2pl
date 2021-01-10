import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = `${environment.apiUrl}/${request.url}`;
    let headers = request.headers;
    const token = this.authService.token;
    if (token) {
      headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
    const req = request.clone({ url, headers });
    return next.handle(req);
  }
}
