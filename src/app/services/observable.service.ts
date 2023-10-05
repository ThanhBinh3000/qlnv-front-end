import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class ObservableService {
  public routerSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  routerObservable = this.routerSubject.asObservable();
}
