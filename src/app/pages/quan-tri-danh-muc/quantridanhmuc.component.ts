import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../services/user.service";
import {UserLogin} from "../../models/userlogin";
@Component({
  selector: 'app-quantridanhmuc',
  templateUrl: './quantridanhmuc.component.html',
  styleUrls: ['./quantridanhmuc.component.scss'],
})
export class QuanTriDanhMucComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  NHAP_MAIN_ROUTE = 'quan-tri-danh-muc';
  userInfo : UserLogin;
  routes = [
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'Danh mục dùng chung',
      url: `/quan-tri-danh-muc/danh-muc-dung-chung`,
      dropdown: 'ql-danh-muc-dung-chung',
      idHover: 'danh-muc-dung-chung',
      permission: this.userService.isAccessPermisson('QTDM_DM_DUNG_CHUNG') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'Danh mục đơn vị',
      url: `/quan-tri-danh-muc/danh-muc-don-vi`,
      dropdown: 'danh-muc-don-vi',
      idHover: 'danh-muc-don-vi',
      permission: this.userService.isAccessPermisson('QTDM_DM_DON_VI') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'Danh mục hàng DTQG',
      url: `/quan-tri-danh-muc/danh-muc-hang-hoa`,
      dropdown: 'danh-muc-hang-hoa',
      idHover: 'danh-muc-hang-hoa',
      permission: this.userService.isAccessPermisson('QTDM_DM_HANG_DTQG') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'DM định mức phí nhập, xuất, bảo quản',
      url: `/quan-tri-danh-muc/danh-muc-dinh-muc-phi`,
      dropdown: 'danh-muc-dinh-muc-phi',
      idHover: 'danh-muc-dinh-muc-phi',
      permission: this.userService.isAccessPermisson('QTDM_DM_DMPHI_NXBQ') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'DM định mức hao hụt',
      url: `/quan-tri-danh-muc/danh-muc-dinh-muc-hao-hut`,
      dropdown: 'danh-muc-dinh-muc-hao-hut',
      idHover: 'danh-muc-dinh-muc-hao-hut',
      permission: this.userService.isAccessPermisson('QTDM_DM_DINHMUC_HAOHUT') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'DM công cụ, dụng cụ',
      url: `/quan-tri-danh-muc/danh-muc-cong-cu-dung-cu`,
      dropdown: 'danh-muc-cong-cu-dung-cu',
      idHover: 'danh-muc-cong-cu-dung-cu',
      permission: this.userService.isAccessPermisson('QTDM_DM_CONGCU_DUNGCU') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'Danh mục tài sản',
      url: `/quan-tri-danh-muc/danh-muc-tai-san`,
      dropdown: 'danh-muc-tai-san',
      idHover: 'danh-muc-tai-san',
      permission: this.userService.isAccessPermisson('QTDM_DM_TAI_SAN') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'DM đơn vị liên quan',
      url: `/quan-tri-danh-muc/danh-muc-dvi-lien-quan`,
      dropdown: 'danh-muc-dvi-lien-quan',
      idHover: 'danh-muc-dvi-lien-quan',
      permission: this.userService.isAccessPermisson('QTDM_DM_DVI_LIENQUAN') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'Danh mục thủ kho',
      url: `/quan-tri-danh-muc/danh-muc-thu-kho`,
      dropdown: 'danh-muc-thu-kho',
      idHover: 'danh-muc-thu-kho',
      permission: this.userService.isAccessPermisson('QTDM_DM_THU_KHO') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_icon-common',
      title: 'DM Chỉ tiêu chất lượng',
      url: `/quan-tri-danh-muc/danh-muc-chi-tieu-chat-luong`,
      dropdown: 'danh-muc-chi-tieu-chat-luong',
      idHover: 'danh-muc-chi-tieu-chat-luong',
      permission : true
    },
  ];
  routerUrl: string = "";
  routerUrlActive : string = "";
  isCollapsed: boolean = true;
  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    if (this.router.url) {
      this.routerUrl = this.router.url;
      this.activeUrl(this.router.url);
    }
  }

  activeUrl(url): void{
    if (this.router.url) {
      const urlC =  url.split("/");
      this.routerUrlActive = urlC[urlC.length - 1]
    }
  }
  ngAfterViewInit() {
    // if (
    //   this.myTab.nativeElement.scrollWidth >
    //   this.myTab.nativeElement.clientWidth
    // ) {
    //   this.myTab.nativeElement.className =
    //     'nav nav-tabs expand-sidebar next-an';
    // } else {
    //   this.myTab.nativeElement.className = 'nav nav-tabs';
    // }
  }

  routerNavigate(url) {
    this.routerUrl = url;
    this.activeUrl(url);
    this.router.navigateByUrl(url);
  }
  updateCssOverlay() {
    setTimeout(() => {
      let child = document.getElementsByClassName('dau-thau-tab');
      if (child && child.length > 0) {
        child[0].parentElement.classList.add('left-0');
      }
    }, 200);
  }

  endSlide() {
    if (
      this.myTab.nativeElement.scrollWidth >
      this.myTab.nativeElement.clientWidth
    ) {
      this.myTab.nativeElement.scrollTo({
        left: this.myTab.nativeElement.scrollWidth,
        top: 0,
        behavior: 'smooth',
      });
      this.myTab.nativeElement.className =
        'nav nav-tabs expand-sidebar prev-an';
    }
  }

  startSlide() {
    if (
      this.myTab.nativeElement.scrollWidth >
      this.myTab.nativeElement.clientWidth
    ) {
      this.myTab.nativeElement.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
      this.myTab.nativeElement.className =
        'nav nav-tabs expand-sidebar next-an';
    }
  }

  openNav() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      document.getElementById("mySidebar").classList.add('show');
      document.getElementById("mySidebar").style.width = "300px";
      document.getElementById("main").style.marginLeft = "300px";
    } else {
      document.getElementById("mySidebar").classList.remove('show');
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "16px";
    }
  }


}
