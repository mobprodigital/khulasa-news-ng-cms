import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth/auth.service';

@Injectable()
export class AjaxInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.authService.token;
        const loggedInUser = this.authService.loggedInUser;
        if (token && loggedInUser) {
            request = request.clone({
                headers: request.headers
                     .set('token', this.authService.token)
                     .set('userId', loggedInUser.userId.toString())
                     .set('roleId', loggedInUser.role.roleId.toString())
            });

        }

        console.log(request.headers.getAll('token'));

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        // return next.handle(request);

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }));
    }
}
