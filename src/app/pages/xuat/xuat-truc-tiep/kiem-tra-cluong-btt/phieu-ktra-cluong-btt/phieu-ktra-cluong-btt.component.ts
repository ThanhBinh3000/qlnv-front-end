import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-phieu-ktra-cluong-btt',
  templateUrl: './phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./phieu-ktra-cluong-btt.component.scss']
})
export class PhieuKtraCluongBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  children: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idBienBan: number = 0;
  isViewBienBan: boolean = false;
  selectedId: number = 0;
  isView = false;
  dataView: any = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQd: null,
      soPhieu: null,
      loaiVthh: null,
      trichYeu: null,
      ngayTao: null,
      maDvi: null,
    })

    this.filterTable = {
      soQd: '',
      namKh: '',
      ngayTao: '',
      soPhieu: '',
      ngayKnghiem: '',
      tenDiemKho: '',
      tenLoKho: '',
      soBienBan: '',
      ngayLayMau: '',
      tenTrangThai: '',

    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
      })
      await this.search();
      this.buildTableView();
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
          this.phieuKtraCluongBttService.delete(body).then(async () => {
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
    console.log(JSON.stringify(this.dataTable), 'raw')
    let dataView = chain(this.dataTable)
      .groupBy("soQd")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maLoKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maLoKho === k);
            return {
              id: rowLv2.id,
              idVirtual: uuidv4(),
              maDiemKho: rowLv2.maDiemKho,
              tenDiemKho: rowLv2.tenDiemKho,
              maNhaKho: rowLv2.maNhaKho,
              tenNhaKho: rowLv2.tenNhaKho,
              maNganKho: rowLv2.maNganKho,
              tenNganKho: rowLv2.tenNganKho,
              maLoKho: k,
              tenLoKho: rowLv2.tenLoKho,
              soPhieu: rowLv2.soPhieu,
              ngayKnghiem: rowLv2.ngayKnghiem,
              soBienBan: rowLv2.soBienBan,
              ngayLayMau: rowLv2.ngayLayMau,
              soBbXuatDoc: rowLv2.soBbXuatDoc,
              ngayXuatDocKho: rowLv2.ngayXuatDocKho,
              trangThai: rowLv2.trangThai,
              tenTrangThai: rowLv2.tenTrangThai,
              childData: v
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQd === key);
        return {
          idVirtual: uuidv4(),
          soQd: key,
          namKh: rowLv1.namKh,
          ngayQd: rowLv1.ngayQd,
          idQd: rowLv1.idQd,
          childData: rs
        };
      }).value();
    this.dataView = dataView
    this.expandAll()
  }

  editRow(lv2: any, isView: boolean) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
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

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }

  openModalSoBienBan(id: number) {
    this.idBienBan = id;
    this.isViewBienBan = true;
  }

  closeModaSoBienBan() {
    this.idBienBan = null;
    this.isViewBienBan = false;
  }

}
