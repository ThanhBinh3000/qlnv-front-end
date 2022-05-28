import { convertTenVthh } from 'src/app/shared/commonFunction';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss']
})
export class DanhSachHopDongComponent implements OnInit {
  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    router.events.subscribe((val) => {
      this.getTitleVthh();
    })
  }

  ngOnInit() {
  }

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/")) {
      this.loaiStr = "Thóc";
      this.loaiVthh = "01";
      this.maVthh = "0101";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/")) {
      this.loaiStr = "Gạo";
      this.loaiVthh = "00";
      this.maVthh = "0102";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/")) {
      this.loaiStr = "Muối";
      this.loaiVthh = "02";
      this.maVthh = "04";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/")) {
      this.loaiStr = "Vật tư";
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
  }
}
