import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // if(req.url !== '')
    console.log('Auth Interceptor called!');
    return next.handle(req);
  }
}
