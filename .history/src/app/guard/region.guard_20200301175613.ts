import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RegionService } from '../services/region.service';
import { UidService } from '../services/uid.service';


@Injectable({
  providedIn: 'root'
})
export class RegionGuard implements CanActivate {

  constructor(
    private router: Router,
    private regionService: RegionService,
    private uidService: UidService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const region = this.uidService.getRegion();
      if (region) {
        return true;
      } else {
        return this.regionService.getRegionStorage().then(resp => {
          if (resp) {
            return true;
          } else {
            return this.regionService.getRegiones().then(regiones => {
              if (regiones.length > 1) {
                this.router.navigate(['/region']);
                return false;
              } else {
                // Sólo hay una región y es Ojocaliente
                this.regionService.setRegion('ojocaliente');
                return true;
              }
            });
          }
        });
      }
  }

}
