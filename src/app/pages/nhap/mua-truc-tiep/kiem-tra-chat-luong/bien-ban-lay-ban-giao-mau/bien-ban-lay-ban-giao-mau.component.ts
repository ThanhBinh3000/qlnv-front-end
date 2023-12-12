import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { cloneDeep } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { async } from '@angular/core/testing';
import { MttBienBanLayMauService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanLayMauService.service';
import { STATUS } from "../../../../../constants/status";
@Component({
  selector: 'app-bien-ban-lay-ban-giao-mau',
  templateUrl: './bien-ban-lay-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-ban-giao-mau.component.scss']
})
export class BienBanLayBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  typeVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number
  searchFilter = {
    soPhieu: '',
    ngayTongHop: '',
    ketLuan: '',
    soQuyetDinh: '',
    namKh: '',
  };
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauServive: MttBienBanLayMauService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvNhapHangService);
    this.formData = this.fb.group({
      soQuyetDinhNhap: [],
      soBienBan: [],
      tenDvi: [],
      ngayLayMau: [],

    });

    this.filterTable = {
      namKh: '',
      soDxuat: '',
      ngayTao: '',
      ngayPduyet: '',
      ngayKyQd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      soQdCtieu: '',
      soQdPd: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      // await this.convertDataTable();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    await this.spinner.show();
    let body = {
      soQd: this.searchFilter.soQuyetDinh,
      namNhap: this.searchFilter.namKh,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTable.forEach(item => {
        if (this.userService.isChiCuc()) {
          item.detail = item.hhQdGiaoNvNhangDtlList.filter(y => y.maDvi == this.userInfo.MA_DVI)[0]
          item.detail = {
            children: item.detail.children.filter(x => x.maDiemKho.substring(0, x.maDiemKho.length - 2) == this.userInfo.MA_DVI)
          }
          item.expand = true;
        } else {
          let data = [];
          item.hhQdGiaoNvNhangDtlList.forEach(res => {
            data = [...data, ...res.children.filter(x => x.idDtl == res.id)];
          })
          item.detail = {
            children: data
          }
          item.expand = true;
        };
      });
      this.dataTableAll = cloneDeep(this.dataTable);
      console.log(this.dataTable)
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  async showList() {
    this.isDetail = false;
    await this.search();
    // await this.convertDataTable();
  }
  convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
        item.detail.children = item.detail.listBienBanLayMau

      } else {
        let data = [];
        item.hhQdGiaoNvNhangDtlList.forEach(item => {
          data = [...data, ...item.listBienBanLayMau];
        })
        item.detail = {
          children: data
        }

      };
    });
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh
  }

  async xoaItem(item: any) {
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
          this.bienBanLayMauServive.delete({ id: item.id }).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
              // await this.convertDataTable();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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

  goDetail(id?: number, idQdGiaoNvu?: number, isView?: boolean) {
    this.selectedId = id;
    this.idQdGiaoNvNh = idQdGiaoNvu;
    this.isDetail = true;
    this.isView = isView;
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }
}
