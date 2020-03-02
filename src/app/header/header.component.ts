import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataStorageService } from '../shared/services/data-storage.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<any>();
  isAuthenticated: boolean = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$
    .pipe(takeUntil(this.onDestroy))
    .subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes()
    .pipe(takeUntil(this.onDestroy))
    .subscribe();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes()
    .pipe(takeUntil(this.onDestroy))
    .subscribe();
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
