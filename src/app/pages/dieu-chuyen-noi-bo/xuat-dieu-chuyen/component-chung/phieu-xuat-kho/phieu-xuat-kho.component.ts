import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { v4 as uuidv4 } from 'uuid';
import { chain, groupBy } from 'lodash';
@Component({
  selector: 'app-xuat-dcnb-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoDCNBComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string[];

  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvXh: number = 0;
  dataView: any = [];
  expandSetString = new Set<string>();
  idPhieu: number = 0;
  isViewPhieu: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoBttService);
    this.formData = this.fb.group({
      namKh: null,
      soBienBan: null,
      soQd: null,
      trichYeu: null,
      ngayLayMau: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQd: '',
      namKh: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.typeVthh,
        maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.phieuXuatKhoBttService.delete(body).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }


  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdNv")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            let rsx = chain(v).groupBy("maLoKho").map((x, ix) => {
              const rowLv3 = x.find(f => f.maLoKho == ix);
              return {
                ...rowLv3,
                idVirtual: uuidv4(),
                childData: x
              }
            }).value();
            return {
              ...rowLv2,
              idVirtual: uuidv4(),
              childData: rsx
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdNv === key);
        return {
          idVirtual: uuidv4(),
          soQdNv: key,
          namKh: rowLv1.namKh,
          ngayQdNv: rowLv1.ngayQdNv,
          idQdNv: rowLv1.idQdNv,
          childData: rs
        };
      }).value();
    this.dataView = dataView
    this.expandAll()
  }

  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  redirectToChiTiet(lv2: any, isView: boolean, idQdGiaoNvXh?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvXh = idQdGiaoNvXh;
  }


  openModalPhieuXuatKho(id: number) {
    this.idPhieu = id;
    this.isViewPhieu = true;
  }

  closeModalPhieuXuatKho() {
    this.idPhieu = null;
    this.isViewPhieu = false;
  }


}

