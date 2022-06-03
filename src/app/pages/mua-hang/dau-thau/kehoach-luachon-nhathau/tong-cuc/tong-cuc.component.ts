import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LEVEL, LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { convertIdToLoaiVthh, convertTenVthh, convertTrangThai } from 'src/app/shared/commonFunction';


@Component({
  selector: 'app-tong-cuc',
  templateUrl: './tong-cuc.component.html',
  styleUrls: ['./tong-cuc.component.scss']
})
export class TongCucComponent implements OnInit {
  lydotuchoi = false;
  dinhkem = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }
  loaiVthh: string;
  selectedTab: string = 'tong-hop';
  async ngOnInit() {
    this.referTabLv1(LIST_VAT_TU_HANG_HOA[0]);

  }

  listVthh: any = LIST_VAT_TU_HANG_HOA;
  tabMenu = [
    {
      text: 'Tổng hợp kế hoạch lựa chọn nhà thầu',
      value: 'tong-hop'
    },
    {
      text: 'Quyết định phê duyệt kế hoạch lựa chọn nhà thầu',
      value: 'phe-duyet'
    }
  ];

  referTabLv1(event) {
    this.loaiVthh = convertIdToLoaiVthh(event.value);
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + convertIdToLoaiVthh(event.value) + '/' + this.selectedTab]);
  }

  referTabLv2(event) {
    this.selectedTab = event.value;
    this.router.navigate(['/mua-hang/dau-thau/kehoach-luachon-nhathau/' + this.loaiVthh + '/' + event.value]);
  }

}
