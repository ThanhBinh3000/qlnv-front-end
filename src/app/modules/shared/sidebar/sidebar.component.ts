import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import * as myGlobals from '../../../globals';
import { AuthService } from '../../auth';
import { BreadcrumbService } from '../../core';
import { UnsavedChangesDialog } from '../dialogs/unsaved-change-dialog/unsaved-changes-dialog.component';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { title: "Trang chủ", path: "/trang-chu", "icon": "", "class": "" }, 
    { title: "Quản trị hệ thống", path: "/quan-tri-he-thong", "icon": "", "class": "" }, 
    { title: "Quản lý nhập, xuất hàng DTQG", path: "/quan-ly-nhap-xuat-hang-dtqg", "icon": "", "class": "" }, 
    { title: "Quản lý kế hoạch", path: "/quan-ly-ke-hoach", "icon": "", "class": ""}, 
    { title: "Danh mục hệ thống", path: "/danh-muc-he-thong", "icon": "", "class": "" }, 
    { title: "Quản lý người dùng", path: "/quan-ly-nguoi-dung", "icon": "", "class": ""},
    { title: "Quản lý nhóm NSD", path: "/quan-ly-nhom-nsd", "icon": "", "class": ""},
    { title: "Quản lý phân quyền", path: "/quan-ly-phan-quyen", "icon": "", "class": ""},
    { title: "Quản lý tham số hệ thống", path: "/quan-ly-tham-so-he-thong", "icon": "", "class": ""},
    { title: "Quản lý lịch sử truy cập", path: "/quan-ly-lich-su-truy-cap", "icon": "", "class": ""},
    { title: "Quản lý cấu hình hệ thống", path: "/quan-ly-cau-hinh-he-thong", "icon": "", "class": ""},
    { title: "Quản lý thông tin nhập, xuất hàng dự trữ quốc gia", path: "/quan-ly-thong-tin-nhap-xuat-hang-du-tru-quoc-gia", "icon": "", "class": ""},
    { title: "Tổng hợp báo cáo nhập, xuất, tồn gửi TCDT", path: "/tong-hop-bao-cao-nhap-xuat-ton-gui-tcdt", "icon": "", "class": ""},
    { title: "Quản lý Kế hoạch tổng hợp nhập, xuất hàng DTQG", path: "/quan-ly-ke-hoach-tong-hop-nhap-xuat-hang-dtqg", "icon": "", "class": ""},
    { title: "Nhận thông tin các danh mục", path: "/nhan-thong-tin-cac-danh-muc", "icon": "", "class": ""},
    { title: "Quản lý chỉ tiêu kế hoạch năm về hàng DTQG ( Tăng, giảm, luân phiên đổi hàng, Cứu trợ cứu nạn )", path: "/quan-ly-chi-tieu-ke-hoach-nam-ve-hang-dtqg", "icon": "", "class": ""},
    { title: "Kết xuất kế hoạch nhập, xuất hàng DTQG gửi TCDT", path: "/ket-xuat-ke-hoach-nhap-xuat-hang-dtqg-gui-tcdt", "icon": "", "class": ""},
    { title: "Kết xuất chỉ tiêu kế hoạch năm về hàng DTQG gửi TCDT", path: "/ket-xuat-chi-tieu-ke-hoach-nam-ve-hang-dtqg-gui-tcdt", "icon": "", "class": ""},
    { title: "Danh mục đơn vị", path: "/danh-muc-don-vi", "icon": "", "class": ""},
    { title: "Danh mục vật tư hàng hóa", path: "/danh-muc-vat-tu-hang-hoa", "icon": "", "class": ""},
    { title: "Danh mục kho", path: "/danh-muc-kho", "icon": "", "class": ""},
    { title: "Danh mục hàng DTQG", path: "/danh-muc-hang-dtqg", "icon": "", "class": ""},
    { title: "Danh mục đơn vị nhận cứu trợ hàng DTQG", path: "/danh-muc-don-vi-nhan-cuu-tro-hang-dtqg", "icon": "", "class": ""},
    { title: "Danh mục đơn vị tính", path: "/danh-muc-don-vi-tinh", "icon": "", "class": ""},
    { title: "Danh mục nước sản xuất", path: "/danh-muc-nuoc-san-xuat", "icon": "", "class": ""},
    { title: "Danh mục công cụ bảo quản", path: "/danh-muc-cong-cu-bao-quan", "icon": "", "class": ""},
    { title: "Danh mục ĐBHC", path: "/danh-muc-dbhc", "icon": "", "class": ""},
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    currentYear = new Date().getFullYear();
    isLogin$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    role$: Observable<string>;
    breadcrumb = '';
    dynamicBreadcrumb = false;

    role: string;

    activeMenu = false;

    panelOpenState = false;

    @Output() logoutAccount = new EventEmitter<any>();
    menuItems: any = [
        { "panelOpenState": false, "id": 1, "parentId": 0, "menuName": "trang-chu", "displayName": "Trang chủ", "url": "/trang-chu", "role": "", "hasChild": false, "icon": "", "activeIcon": "", "position": 1 }, 
        { "panelOpenState": false, "id": 2, "parentId": 0, "menuName": "quan-tri-he-thong", "displayName": "Quản trị hệ thống", "url": "/quan-tri-he-thong", "role": "admin", "hasChild": true, "icon": "", "activeIcon": "", "position": 2 }, 
        { "panelOpenState": false, "id": 3, "parentId": 0, "menuName": "quan-ly-nhap-xuat-hang-dtqg", "displayName": "Quản lý nhập, xuất hàng DTQG", "url": "/quan-ly-nhap-xuat-hang-dtqg", "role": "admin", "hasChild": true, "icon": "", "activeIcon": "", "position": 3 }, 
        { "panelOpenState": false, "id": 4, "parentId": 0, "menuName": "quan-ly-ke-hoach", "displayName": "Quản lý kế hoạch", "url": "/quan-ly-ke-hoach", "role": "admin", "hasChild": true, "icon": "", "activeIcon": "", "position": 4 }, 
        { "panelOpenState": false, "id": 5, "parentId": 0, "menuName": "danh-muc-he-thong", "displayName": "Danh mục hệ thống", "url": "/danh-muc-he-thong", "role": "", "hasChild": true, "icon": "", "activeIcon": "", "position": 5 }, 
        { "panelOpenState": false, "id": 6, "parentId": 2, "menuName": "quan-ly-nguoi-dung", "displayName": "Quản lý người dùng", "url": "/quan-ly-nguoi-dung", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 6 },
        { "panelOpenState": false, "id": 7, "parentId": 2, "menuName": "quan-ly-nhom-nsd", "displayName": "Quản lý nhóm NSD", "url": "/quan-ly-nhom-nsd", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 7 },
        { "panelOpenState": false, "id": 8, "parentId": 2, "menuName": "quan-ly-phan-quyen", "displayName": "Quản lý phân quyền", "url": "/quan-ly-phan-quyen", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 8 },
        { "panelOpenState": false, "id": 9, "parentId": 2, "menuName": "quan-ly-tham-so-he-thong", "displayName": "Quản lý tham số hệ thống", "url": "/quan-ly-tham-so-he-thong", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 10, "parentId": 2, "menuName": "quan-ly-lich-su-truy-cap", "displayName": "Quản lý lịch sử truy cập", "url": "/quan-ly-lich-su-truy-cap", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 11, "parentId": 2, "menuName": "quan-ly-cau-hinh-he-thong", "displayName": "Quản lý cấu hình hệ thống", "url": "/quan-ly-cau-hinh-he-thong", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 12, "parentId": 3, "menuName": "quan-ly-thong-tin-nhap-xuat-hang-du-tru-quoc-gia", "displayName": "Quản lý thông tin nhập, xuất hàng dự trữ quốc gia", "url": "/quan-ly-thong-tin-nhap-xuat-hang-du-tru-quoc-gia", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 13, "parentId": 3, "menuName": "tong-hop-bao-cao-nhap-xuat-ton-gui-tcdt", "displayName": "Tổng hợp báo cáo nhập, xuất, tồn gửi TCDT", "url": "/tong-hop-bao-cao-nhap-xuat-ton-gui-tcdt", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 14, "parentId": 4, "menuName": "quan-ly-ke-hoach-tong-hop-nhap-xuat-hang-dtqg", "displayName": "Quản lý Kế hoạch tổng hợp nhập, xuất hàng DTQG", "url": "/quan-ly-ke-hoach-tong-hop-nhap-xuat-hang-dtqg", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 15, "parentId": 4, "menuName": "nhan-thong-tin-cac-danh-muc", "displayName": "Nhận thông tin các danh mục", "url": "/nhan-thong-tin-cac-danh-muc", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 16, "parentId": 4, "menuName": "quan-ly-chi-tieu-ke-hoach-nam-ve-hang-dtqg", "displayName": "Quản lý chỉ tiêu kế hoạch năm về hàng DTQG ( Tăng, giảm, luân phiên đổi hàng, Cứu trợ cứu nạn )", "url": "/quan-ly-chi-tieu-ke-hoach-nam-ve-hang-dtqg", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 17, "parentId": 4, "menuName": "ket-xuat-ke-hoach-nhap-xuat-hang-dtqg-gui-tcdt", "displayName": "Kết xuất kế hoạch nhập, xuất hàng DTQG gửi TCDT", "url": "/ket-xuat-ke-hoach-nhap-xuat-hang-dtqg-gui-tcdt", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 18, "parentId": 4, "menuName": "ket-xuat-chi-tieu-ke-hoach-nam-ve-hang-dtqg-gui-tcdt", "displayName": "Kết xuất chỉ tiêu kế hoạch năm về hàng DTQG gửi TCDT", "url": "/ket-xuat-chi-tieu-ke-hoach-nam-ve-hang-dtqg-gui-tcdt", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 19, "parentId": 5, "menuName": "danh-muc-don-vi", "displayName": "Danh mục đơn vị", "url": "/danh-muc-don-vi", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 20, "parentId": 5, "menuName": "danh-muc-vat-tu-hang-hoa", "displayName": "Danh mục vật tư hàng hóa", "url": "/danh-muc-vat-tu-hang-hoa", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 21, "parentId": 5, "menuName": "danh-muc-kho", "displayName": "Danh mục kho", "url": "/danh-muc-kho", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 22, "parentId": 5, "menuName": "danh-muc-hang-dtqg", "displayName": "Danh mục hàng DTQG", "url": "/danh-muc-hang-dtqg", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 23, "parentId": 5, "menuName": "danh-muc-don-vi-nhan-cuu-tro-hang-dtqg", "displayName": "Danh mục đơn vị nhận cứu trợ hàng DTQG", "url": "/danh-muc-don-vi-nhan-cuu-tro-hang-dtqg", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 24, "parentId": 5, "menuName": "danh-muc-don-vi-tinh", "displayName": "Danh mục đơn vị tính", "url": "/danh-muc-don-vi-tinh", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 25, "parentId": 5, "menuName": "danh-muc-nuoc-san-xuat", "displayName": "Danh mục nước sản xuất", "url": "/danh-muc-nuoc-san-xuat", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 26, "parentId": 5, "menuName": "danh-muc-cong-cu-bao-quan", "displayName": "Danh mục công cụ bảo quản", "url": "/danh-muc-cong-cu-bao-quan", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
        { "panelOpenState": false, "id": 27, "parentId": 5, "menuName": "danh-muc-dbhc", "displayName": "Danh mục ĐBHC", "url": "/danh-muc-dbhc", "role": "admin", "hasChild": false, "icon": "", "activeIcon": "", "position": 9 },
    ]
    numberUnread: number = 0

    breadcrumbItems$ = this.breadcrumbService.breadcrumbItems$;
    isStandalonePage = false;

    fullname$: Observable<string>;
    private unsubscribe$ = new Subject();

    childComponent: any;

    constructor(
        private authService: AuthService,
        public cdr: ChangeDetectorRef,
        media: MediaMatcher,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private dialog: MatDialog,
    ) {
        // this.authService.getMenu().subscribe(x => {
        //     if (x){
        //         this.menuItems = x.response?.menus;
        //         this.numberUnread = x.response?.numberUnread;
        //     }
        // });
    }

    public onRouterOutletActivate(event: any) {
        this.childComponent = event;
    }

    ngOnInit() {

        this.isLogin$ = this.authService.isLogin$;

        const user$ = this.authService.user$;
        this.fullname$ = user$.pipe(
            filter(user => !!user),
            map(user => {
                return (user && user.username) || '';
            }),
            shareReplay(1),
            takeUntil(this.unsubscribe$),
        );

        this.role$ = this.authService.user$.pipe(
            filter(user => !!user),
            map(user => (user && user.role ? user.role.toString() : '')),
        );

        this.role$.subscribe(value => {
            this.role = value;
        });
    }

    isMobileMenu() {
        if ($(window).width() > 1100) {
            return false;
        }
        return true;
    }

    logout() {
        this.authService.logout();
    }
}


