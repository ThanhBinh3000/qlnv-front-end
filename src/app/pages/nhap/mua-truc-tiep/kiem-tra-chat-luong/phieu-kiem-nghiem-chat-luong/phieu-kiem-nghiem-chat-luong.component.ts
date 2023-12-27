import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { async } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { MttPhieuKiemNghiemChatLuongService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttPhieuKiemNghiemChatLuongService.service';
@Component({
  selector: 'app-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  typeVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number
  idDiemKho: number
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private phieuKiemNghiemChatLuongService: MttPhieuKiemNghiemChatLuongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvNhapHangService);
    this.formData = this.fb.group({
      namKh: [],
      soQdGiaoNvNh: [],
      soPhieuKiemNghiemCl: [],
      ngayKnghiem: [],
      soBbLayMau: [],
      soBbNhapDayKho: [],
    });

  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.service.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
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
        console.log(this.dataTable)
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }


  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number, idDiemKho?: number) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh
    this.idDiemKho = idDiemKho
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
          this.phieuKiemNghiemChatLuongService.delete({ id: item.id }).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
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

  goDetail(id: number, isView?: any) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }
}
