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
    menuItems: any = []
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
        this.authService.getMenu().subscribe(x => {
            if (x){
                this.menuItems = x.data;
                for(let i = 0; i < this.menuItems.length; i++) {
                    if(this.menuItems[i].parent_id == null){
                        this.menuItems[i].parent_id = 0;
                        let findChid = this.menuItems.filter(x => x.parent_id == this.menuItems[i].id);
                        if(findChid != null && findChid.length > 0){
                            this.menuItems[i].hasChild = true;
                        }
                        else {
                            this.menuItems[i].hasChild = false;
                        }
                    }
                    else {
                        this.menuItems[i].hasChild = false;
                    }
                }
            }
        });
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


