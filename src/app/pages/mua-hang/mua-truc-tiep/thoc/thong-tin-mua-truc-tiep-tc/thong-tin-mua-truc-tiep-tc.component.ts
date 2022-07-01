import { DialogChiTietQuyetDinhKhMuaTrucTiepComponent } from '../../../../../components/dialog/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { DialogChiTietQuyetDinhGiaNhapComponent } from 'src/app/components/dialog/dialog-chi-tiet-quyet-dinh-gia-nhap/dialog-chi-tiet-quyet-dinh-gia-nhap.component';
@Component({
  selector: 'thong-tin-mua-truc-tiep-tc',
  templateUrl: './thong-tin-mua-truc-tiep-tc.component.html',
  styleUrls: ['./thong-tin-mua-truc-tiep-tc.component.scss'],
})
export class ThongTinMuaTrucTiepTCComponent implements OnInit {
  type: number = 1; //1-TC, 2-C, 3-CC

  constructor(
    public globals: Globals,
    private router: Router,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    if (this.router.url.indexOf('ds-thong-tin-mua-truc-tiep-tc') != -1) {
      this.type = 1;
    } else if (this.router.url.indexOf('ds-thong-tin-mua-truc-tiep-cuc') != -1) {
      this.type = 2;
    }
  }
  back() {
    if (this.type == 1) {
      this.router.navigate([
        '/mua-hang/mua-truc-tiep/thoc/ds-thong-tin-mua-truc-tiep-tc',
      ]);
    } else if (this.type == 2) {
      this.router.navigate([
        '/mua-hang/mua-truc-tiep/thoc/ds-thong-tin-mua-truc-tiep-cuc',
      ]);
    }
  }
  huyBo() { }
  themMoi() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Chi tiết quyết định giá nhập',
      nzContent: DialogChiTietQuyetDinhGiaNhapComponent,
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
