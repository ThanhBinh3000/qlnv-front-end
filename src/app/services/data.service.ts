import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private dataSource = new BehaviorSubject(null);
  private unsubscribe$ = new Subject<void>();
  currentData = this.dataSource.asObservable().pipe(takeUntil(this.unsubscribe$));

  constructor() {
  }

  // truyen du lieu giua cac component
  changeData(obj: any) {
    this.dataSource.next(obj);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  removeData() {
    this.dataSource.next(null);
  }
}
