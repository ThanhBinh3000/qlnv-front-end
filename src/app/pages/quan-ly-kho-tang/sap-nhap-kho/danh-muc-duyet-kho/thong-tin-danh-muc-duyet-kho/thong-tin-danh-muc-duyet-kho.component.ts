import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { v4 as uuidv4 } from "uuid";
import { Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../services/storage.service";
import { DonviService } from "../../../../../services/donvi.service";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import { chain, cloneDeep } from 'lodash';
import { FILETYPE } from "../../../../../constants/fileType";
import {
  DanhMucDuyetKhoService
} from "../../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/danh-muc-duyet-kho.service";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thong-tin-danh-muc-duyet-kho',
  templateUrl: './thong-tin-danh-muc-duyet-kho.component.html',
  styleUrls: ['./thong-tin-danh-muc-duyet-kho.component.scss']
})
export class ThongTinDanhMucDuyetKhoComponent extends Base2Component implements OnInit {
  @Input('isView') isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() idInput: number;
  @Input() quyetDinhId: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listFile: any[] = [];
  expandSetString = new Set<string>();
  listTrangThaiSn: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
  ];
  ObTrangThai: { [key: string]: string } = {
    "78": "Chờ duyệt - CB Cục",
    "03": "Từ chối - CB Cục",
    "02": "Đã duyệt - CB Cục"
  }
  dsCuc: any;
  dsCucDi: any;
  dsCucDen: any;
  dsChiCuc: any;
  dsChiCucDi: any;
  dsChiCucDen: any;
  dsKho: any;
  dsKhoDi: any;
  dsKhoDen: any;
  hasError: boolean = false;
  isDisabledThemMoi: boolean = false;

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private router: Router,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private danhMucDuyetKhoService: DanhMucDuyetKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucDuyetKhoService);
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      tenDvi: [],
      nam: [dayjs().get("year"), [Validators.required]],
      soQuyetDinh: [],
      ngayKy: [],
      lyDoTuChoi: [],
      trichYeu: [],
      trangThai: [STATUS.DANG_NHAP_DU_LIEU],
      tenTrangThai: [this.ObTrangThai[STATUS.DANG_NHAP_DU_LIEU]],
      trangThaiSn: [],
      tenTrangThaiSn: [],
      quyetDinhPdDtl: [new Array<ItemXhXkVtquyetDinhPdDtl>()],
      loai: ["SN_DIEM_KHO"],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (this.idInput) {
        await this.getDetail(this.idInput)
      }
      else if (this.quyetDinhId) {
        await this.getDetailTuQuyetDinh(this.quyetDinhId);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      await this.spinner.hide()
    }
  }

  navigateMLK(maDiemKho) {
    this.router.navigate(['quan-ly-kho-tang/mang-luoi-kho', { maDiemKho }]);
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có muốn duyệt bản ghi này?.`,
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            trangThai: '02'
          };
          let res =
            await this.danhMucDuyetKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, res.msg);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
          await this.spinner.hide()
        }
      },
    });
  };
  async tuChoi(): Promise<void> {
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
        await this.spinner.show();
        try {
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          let res =
            await this.danhMucDuyetKhoService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, res.msg);
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
          await this.spinner.hide();

        }
      }
    });
  }
  back() {
    this.showListEvent.emit();
  }

  // async flattenTree(tree) {
  //   return tree.flatMap((item) => {
  //     return item.childData ? this.flattenTree(item.childData) : item;
  //   });
  // }


  async getDetailTuQuyetDinh(id: number) {
    await this.danhMucDuyetKhoService
      .getDetailTuQD({ id, maDvi: this.userInfo.MA_DVI })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          if (dataDetail) {
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.dataTable = dataDetail.duyetDanhMucKhoDtl
              ;
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
  async getDetail(id: number) {
    await this.danhMucDuyetKhoService
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          if (dataDetail) {
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.dataTable = dataDetail.duyetDanhMucKhoDtl
              ;
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
  checkRoleApprove(trangThai: string) {
    return ['03', '78'].includes(trangThai) && this.userService.isAccessPermisson("QLKT_THSDK_DDDM_DUYET") && this.userService.isCuc();
  }
  checkRoleReject(trangThai: string) {
    return ['78'].includes(trangThai) && this.userService.isAccessPermisson("QLKT_THSDK_DDDM_DUYET") && this.userService.isCuc();
  }
}


export class ItemXhXkVtquyetDinhPdDtl {
  id: string;
  maDiaDiemDi: string;
  maCucDi: string;
  tenCucDi: string;
  maChiCucDi: string;
  tenChiCucDi: string;
  maDiemKhoDi: string;
  tenDiemKhoDi: string;
  maDiaDiemDen: string;
  maCucDen: string;
  tenCucDen: string;
  maChiCucDen: string;
  tenChiCucDen: string;
  maDiemKhoDen: string;
  tenDiemKhoDen: string;
  ghiChu: string;
}
