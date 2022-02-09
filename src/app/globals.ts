import { Subject } from "rxjs";

export let menuSub$: Subject<[]> = new Subject<[]>();
export let menuItems$ = menuSub$.asObservable();

export let openNotificationSub$: Subject<boolean> = new Subject<boolean>();
export let openNotification$ = openNotificationSub$.asObservable();

export let emailAddUserSub$: Subject<string> = new Subject<string>();
export let emailAddUser$ = emailAddUserSub$.asObservable();

export let userNameAddUserSub$: Subject<string> = new Subject<string>();
export let userNameAddUser$ = userNameAddUserSub$.asObservable();

export let productNameAddProductSub$: Subject<string> = new Subject<string>();
export let productNameAddProduct$ = productNameAddProductSub$.asObservable();

export let skuCodeAddProductSub$: Subject<string> = new Subject<string>();
export let skuCodeAddProduct$ = skuCodeAddProductSub$.asObservable();

export let warehouseNameAddWarehouseSub$: Subject<string> = new Subject<string>();
export let warehouseNameAddWarehouse$ = warehouseNameAddWarehouseSub$.asObservable();

export let countryNameAddWarehouseSub$: Subject<string> = new Subject<string>();
export let countryNameAddWarehouse$ = countryNameAddWarehouseSub$.asObservable();

export let warehouseNameAddWarehouseProductSub$: Subject<string> = new Subject<string>();
export let warehouseNameAddWarehouseProduct$ = warehouseNameAddWarehouseProductSub$.asObservable();

export let quantityAddWarehouseProductSub$: Subject<string> = new Subject<string>();
export let quantityAddWarehouseProduct$ = quantityAddWarehouseProductSub$.asObservable();

export let productNameAddWarehouseProductSub$: Subject<string> = new Subject<string>();
export let productNameAddWarehouseProduct$ = productNameAddWarehouseProductSub$.asObservable();

export let typeDateSub$: Subject<any> = new Subject<any>();
export let typeDate$ = typeDateSub$.asObservable();

export let containerSub$: Subject<any> = new Subject<any>();
export let container$ = containerSub$.asObservable();

export let nurseSub$: Subject<any> = new Subject<any>();
export let nurse$ = nurseSub$.asObservable();

export let bookingSub$: Subject<any> = new Subject<any>();
export let booking$ = bookingSub$.asObservable();

export let containerAddNewSub$: Subject<string> = new Subject<string>();
export let containerAddNew$ = containerAddNewSub$.asObservable();
