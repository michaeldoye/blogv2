import {
  Component,
  ChangeDetectorRef,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidenavService } from '../../../shared/services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements AfterViewInit {
  @ViewChild('snav') public snav: MatSidenav;

  isDarkTheme: boolean = false;

  mobileQuery: MediaQueryList;

  fillerNav = Array(20)
    .fill(0)
    .map((_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sidenavService: SidenavService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.snav);
  }

  changeTheme(): void {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
    } else {
      this.isDarkTheme = true;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
