import { DialogChiTietQuyetDinhKhMuaTrucTiepComponent } from './../../../../../components/dialog/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc',
  templateUrl: './thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc.component.html',
  styleUrls: ['./thong-tin-qd-phe-duyet-kh-mua-truc-tiep-tc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinQDPheDuyetKhMuaTrucTiepTCComponent implements OnInit {
  constructor(
    public globals: Globals,
    private router: Router,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {}
  back() {
    this.router.navigate([
      '/mua-hang/mua-truc-tiep/thoc/ds-quyet-dinh-phe-duyet-mua-truc-tiep-tc',
    ]);
  }
  huyBo() {}
  themMoi() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Chi tiêt quyết định',
      nzContent: DialogChiTietQuyetDinhKhMuaTrucTiepComponent,
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
