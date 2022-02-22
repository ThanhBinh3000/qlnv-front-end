import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ObservableService {
  routerSubject: Subject<any> = new Subject();
  routerObservable = this.routerSubject.asObservable();
}