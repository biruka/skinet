import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError,delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if(error) {
          console.log(error.status);
          if(error.status === 400){
            if(error.console.error){
                throw error.error;
            }
            else{
            this.toastr.error(error.error.message, error.error.statusCode);
            }
          }
          if(error.status === 401){
            this.toastr.error(error.error.message, error.error.statusCode);
          }
          if(error.status === 404){
            this.router.navigateByUrl('/not-found');
          }
          if(error.status === 500) {
            const navigtionExtras: NavigationExtras = {state: {error: error.error}};
            this.router.navigateByUrl('/server-error',navigtionExtras);
          }
        }
        return throwError(error);
      })
    )
  }
}
