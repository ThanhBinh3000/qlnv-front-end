import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    private dataSource = new BehaviorSubject(null);
    currentData = this.dataSource.asObservable();

    constructor() { }
    // truyen du lieu giua cac component
    changeData(obj: any) {
        this.dataSource.next(obj);
    }
}