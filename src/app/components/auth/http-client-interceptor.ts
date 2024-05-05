import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Verifică dacă URL-ul cererii conține structura specificată
    if (req.url.includes('https://api.exchangerate-api.com/v4/latest/')) {
      // Trece cererea mai departe fără a adăuga antetul de autorizare
      return next.handle(req);
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
