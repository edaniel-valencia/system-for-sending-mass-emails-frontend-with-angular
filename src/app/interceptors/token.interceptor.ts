import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { TokenService } from '../services/token.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('myToken');

  const clonedRequest = token
    ? req.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    })
    : req;

    return next(clonedRequest).pipe(
      catchError((error) => {
        const router = inject(Router)
        const _errorService = inject(ErrorService)


        if(error.status === 401){
          router.navigate(['/'])
        }

        _errorService.messageError(error)

        return throwError(() => error)
       })
    )
}
