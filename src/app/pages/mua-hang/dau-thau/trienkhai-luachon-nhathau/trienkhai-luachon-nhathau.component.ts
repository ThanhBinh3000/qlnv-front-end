import { L } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertIdToLoaiVthh, convertTenVthh } from 'src/app/shared/commonFunction';

@Component({
  selector: 'app-trienkhai-luachon-nhathau',
  templateUrl: './trienkhai-luachon-nhathau.component.html',
  styleUrls: ['./trienkhai-luachon-nhathau.component.scss']
})
export class TrienkhaiLuachonNhathauComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }
  loaiVthh: string = 'thoc'
  selectedTab: string = 'thongtin-dauthau'
  ngOnInit(): void {
    this.referTabLv1(LIST_VAT_TU_HANG_HOA[0]);
  }

  listVthh: any = LIST_VAT_TU_HANG_HOA;

  tabMenu = [
    {
      text: 'Nhập thông tin đấu thầu',
      value: 'thongtin-dauthau'
    },
    {
      text: 'Nhập quyết định kết quả lựa chọn nhà thầu',
      value: 'ketqua-dauthau'
    }
  ];


  referTabLv1(event) {
    this.loaiVthh = convertIdToLoaiVthh(event.value);
    this.router.navigate(['/mua-hang/dau-thau/trienkhai-luachon-nhathau/' + convertIdToLoaiVthh(event.value) + '/' + this.selectedTab]);
  }

  referTabLv2(event) {
    this.selectedTab = event.value;
    this.router.navigate(['/mua-hang/dau-thau/trienkhai-luachon-nhathau/' + this.loaiVthh + '/' + event.value]);
  }
}
