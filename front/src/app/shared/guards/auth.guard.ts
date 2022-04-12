import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated: boolean) => {
        if (state.url.startsWith('/auth')) {
          this.router.navigate(['/editor']);
          return false;
        }
        return true;
      }),
      catchError((err) => {
        console.log(err);
        if (route.data.checkUser) this.router.navigate(['/auth/login']);
        return of(!route.data.checkUser);
      }),
    );
  }
}
