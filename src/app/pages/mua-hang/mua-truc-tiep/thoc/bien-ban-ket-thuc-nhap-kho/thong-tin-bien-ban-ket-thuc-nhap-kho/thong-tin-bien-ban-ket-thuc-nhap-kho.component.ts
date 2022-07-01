import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogChiTietHangHoaNhapKhoComponent } from 'src/app/components/dialog/dialog-chi-tiet-hang-hoa-nhap-kho/dialog-chi-tiet-hang-hoa-nhap-kho.component';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';

@Component({
  selector: 'thong-tin-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho.component.scss'],
})
export class ThongTinBienBanKetThucNhapKhoComponent implements OnInit {
  code: string = '/QĐ-TCDT';

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [{
    id: 1
  }];

  constructor(
    private router: Router,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
  }

  back() {
    this.router.navigate(['/mua-hang/mua-truc-tiep/thoc/bien-ban-ket-thuc-nhap-kho']);
  }

  async changePageIndex(event) {

  }

  async changePageSize(event) {

  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => { },
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => { },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.router.navigate([
          '/nhap/dau-thau/vat-tu/thong-tin-lcnt',
        ]);
      },
    });
  }

  openDialogChiTietHangHoaNhapKho(data?: any) {
    const modalQD = this.modal.create({
      nzTitle: 'thông tin chi tiết hàng hóa nhập kho',
      nzContent: DialogChiTietHangHoaNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {

      }
    });
  }
}
