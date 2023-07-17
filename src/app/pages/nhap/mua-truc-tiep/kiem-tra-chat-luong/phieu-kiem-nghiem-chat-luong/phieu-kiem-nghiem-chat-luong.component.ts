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
      await this.convertDataTable();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async showList() {
    this.isDetail = false;
    await this.search();
    await this.convertDataTable();
  }
  async convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
        // if (item.detail) {
        //   item.detail.children = item.detail.listPhieuKiemNghiemCl
        // }
      } else {
        let data = [];
        item.hhQdGiaoNvNhangDtlList.forEach(item => {
          data = [...data, ...item.listPhieuKiemNghiemCl];
        })
        item.detail = {
          listPhieuKiemNghiemCl: data
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
          this.phieuKiemNghiemChatLuongService.delete({ id: item.id }).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.search();
              await this.convertDataTable();
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
}
