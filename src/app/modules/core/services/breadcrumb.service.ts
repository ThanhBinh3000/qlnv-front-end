import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BreadcrumbAction, BreadCrumbItem } from '../types';

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private breadcrumbItemsSub$ = new BehaviorSubject<BreadCrumbItem[]>([]);
    breadcrumbItems$ = this.breadcrumbItemsSub$.asObservable();

    private actionsSub = new BehaviorSubject<BreadcrumbAction[]>([]);
    actions$ = this.actionsSub.asObservable();

    private contextSub$ = new Subject<any>();
    context$ = this.contextSub$.asObservable();

    getBreadCrumbItems(): any[] {
        let items = localStorage.getItem('breadCumbItems');
        if (items) {
            return JSON.parse(items);
        }
        return [];
    }

    setBreadCrumbItemsFirstPage(items: any[]) {
        this.clearBreadCrumbItems()
        localStorage.setItem('breadCumbItems', JSON.stringify(items));
        this.updateBreadCrumbItems([]);
    }

    setBreadCrumbItems(items: any[]) {
        localStorage.setItem('breadCumbItems', JSON.stringify(items));
        this.updateBreadCrumbItems(items);
    }

    updateBreadCrumbItemsWithItem(item: any) {
        let currentItems = this.getBreadCrumbItems();
        if (currentItems.filter(x => (x.name === item.name && x.path === item.path)).length === 0) {
            currentItems.push(item);
        } else {
            let index = -1
            for (let i = 0; i < currentItems.length; i++) {
                let x = currentItems[i];
                if (x.name === item.name && x.path === item.path) {
                    index = i;
                }
            }
            if (index !== -1) {
                currentItems.splice(index + 1)
            }
        }

        this.setBreadCrumbItems(currentItems);
        this.updateBreadCrumbItems(currentItems);
    }

    removeLastItem() {
        let currentItems = this.getBreadCrumbItems();
        currentItems.splice(-1);
        this.setBreadCrumbItems(currentItems);
    }

    // private setBreadCrumbItem(item: any) {
    //     let currentItems = this.getBreadCrumbItems();
    //     currentItems.push(item);
    //     this.setBreadCrumbItems(currentItems);
    // }

    clearBreadCrumbItems() {
        localStorage.removeItem('breadCumbItems');
    }

    updateBreadCrumbItems(items: BreadCrumbItem[]) {
        this.breadcrumbItemsSub$.next(items);
    }

    createBreadcrumbs(_urls: string[], _breadCrumbKey: string) {
        const breadcrumbItems: BreadCrumbItem[] = [];
        this.updateBreadCrumbItems(breadcrumbItems);
    }

    setContext(context: any) {
        this.contextSub$.next(context);
    }

    setActions(actions: BreadcrumbAction[]) {
        this.actionsSub.next(actions);
    }

    clearActions() {
        this.actionsSub.next([]);
    }
}
