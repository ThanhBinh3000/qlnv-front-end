import { DialogChiTietQuyetDinhKhMuaTrucTiepComponent } from '../../../../../components/dialog/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { DialogChiTietQuyetDinhGiaNhapComponent } from 'src/app/components/dialog/dialog-chi-tiet-quyet-dinh-gia-nhap/dialog-chi-tiet-quyet-dinh-gia-nhap.component';
import { DialogThongTinKeLotBaoQuanBanDauComponent } from 'src/app/components/dialog/dialog-them-thong-tin-ke-lot-bao-quan-ban-dau/dialog-them-thong-tin-ke-lot-bao-quan-ban-dau.component';
@Component({
  selector: 'thong-tin-bien-ban-nghiem-thu-ke-lot-tc',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-ke-lot-tc.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-ke-lot-tc.component.scss'],
})
export class ThongTinBienBanNghiemThuKeLotTCComponent implements OnInit {
  constructor(
    public globals: Globals,
    private router: Router,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {}
  back() {
    this.router.navigate([
      '/mua-hang/mua-truc-tiep/thoc/ds-bien-ban-nghiem-thu-ke-lot-tc',
    ]);
  }
  huyBo() {}
  themMoi() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThongTinKeLotBaoQuanBanDauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }
}
