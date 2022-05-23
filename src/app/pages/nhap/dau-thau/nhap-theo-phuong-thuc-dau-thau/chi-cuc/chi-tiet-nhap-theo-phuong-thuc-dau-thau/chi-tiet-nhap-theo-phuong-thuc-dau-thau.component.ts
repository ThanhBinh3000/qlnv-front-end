import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertTenVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-chi-tiet-nhap-theo-phuong-thuc-dau-thau',
  templateUrl: './chi-tiet-nhap-theo-phuong-thuc-dau-thau.component.html',
  styleUrls: ['./chi-tiet-nhap-theo-phuong-thuc-dau-thau.component.scss']
})
export class ChiTietNhapTheoPhuongThucDauThauComponent implements OnInit {
  lastBreadcrumb: string;
  loaiVthh: string;
  routerVthh: string;
  title: string;
  selectedTab: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    router.events.subscribe((val) => {
      this.getTitleVthh();
    });
  }

  ngOnInit() {
    this.getTitleVthh();
    this.selectTabMenu('bien-ban', 'Lập biên bản nghiệm thu bảo quản lần đầu nhập hàng dự trữ quốc gia');
  }

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/")) {
      this.loaiVthh = "Thóc";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/")) {
      this.loaiVthh = "Gạo";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/")) {
      this.loaiVthh = "Muối";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/")) {
      this.loaiVthh = "Vật tư";
      this.routerVthh = 'vat-tu';
    }
  }

  selectTabMenu(tab, title) {
    this.selectedTab = tab;
    this.title = title;
    // this.router.navigate(['/nhap/nhap-theo-ke-hoach/nhap-theo-phuong-thuc-dau-thau/' + this.routerVthh + '/chi-tiet/' + this.route.snapshot.paramMap.get('id') + '/' + tab]);
  }
}
