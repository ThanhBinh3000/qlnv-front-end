import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DonviService } from 'src/app/services/donvi.service';
import { chain, cloneDeep } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Subject } from 'rxjs';
import { PhieuKiemTraChatLuongService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-tra-chat-luong';
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { ThongTinBienBanNghiemThuBaoQuanLanDauComponent } from '../../bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component';

@Component({
  selector: 'app-kiem-tra-chat-luong',
  templateUrl: './kiem-tra-chat-luong.component.html',
  styleUrls: ['./kiem-tra-chat-luong.component.scss']
})
export class KiemTraChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
    private phieuKiemTraChatLuongService: PhieuKiemTraChatLuongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemTraChatLuongService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      soPhieu: null,
      tuNgayLapPhieu: null,
      denNgayLapPhieu: null,
      tuNgayGiamDinh: null,
      denNgayGiamDinh: null,
      ketQua: null,
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      thayDoiThuKho: []
    })
  }


  data: any;
  dsQuyetDinh: any[] = [];
  dataTableView: any[] = [];
  selectedId: number = 0;
  isView = false;

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    this.formData.patchValue({
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: true
    })

    try {
      this.initData()
      await this.timKiem();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  disabledStartNgayLap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayLapPhieu) {
      return startValue.getTime() > this.formData.value.denNgayLapPhieu.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayLap = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayLapPhieu) {
      return endValue.getTime() < this.formData.value.tuNgayLapPhieu.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayGD = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayGiamDinh) {
      return startValue.getTime() > this.formData.value.denNgayGiamDinh.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayGD = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayGiamDinh) {
      return endValue.getTime() < this.formData.value.tuNgayGiamDinh.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  isSua(row) {
    return row.trangThai == STATUS.DU_THAO || row.trangThai == STATUS.TU_CHOI_LDCC
  }

  selectTab(tab: number) {
    if (this.isDetail) {
      this.quayLai()
    }
    this.tabSelected = tab;
  }

  async initData() {
    this.formData.patchValue({
      loaiDc: this.loaiDc
    })
    this.getDSQD()
  }

  async getDSQD() {
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiDc: this.loaiDc,
      maDvi: this.userInfo.MA_DVI
    }
    let resSoDX = await this.quyetDinhDieuChuyenCucService.getDsSoQuyetDinhDieuChuyenChiCuc(body);
    if (resSoDX.msg == MESSAGE.SUCCESS) {
      this.dsQuyetDinh = resSoDX.data;
    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  async changePageIndex(event) {
    this.page = event;
    await this.timKiem();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.timKiem();
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.tuNgayLapPhieu) {
        this.formData.value.tuNgayLapPhieu = dayjs(this.formData.value.tuNgayLapPhieu).format('YYYY-MM-DD')
      }
      if (this.formData.value.denNgayLapPhieu) {
        this.formData.value.denNgayLapPhieu = dayjs(this.formData.value.denNgayLapPhieu).format('YYYY-MM-DD')
      }
      if (this.formData.value.tuNgayGiamDinh) {
        this.formData.value.tuNgayGiamDinh = dayjs(this.formData.value.tuNgayGiamDinh).format('YYYY-MM-DD')
      }
      if (this.formData.value.denNgayGiamDinh) {
        this.formData.value.denNgayGiamDinh = dayjs(this.formData.value.denNgayGiamDinh).format('YYYY-MM-DD')
      }

      let body = this.formData.value
      // if (body.soQdinh) body.soQdinh = `${body.soQdinh}/DCNB`
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.phieuKiemTraChatLuongService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.totalRecord = res.data.totalElements;
        this.dataTable = data.content.map(element => {
          return {
            ...element,
            maKhoXuat: `${element.thoiHanDieuChuyen}${element.maLoKhoXuat}${element.maNganKhoXuat}`,
            maloNganKhoNhan: `${element.maLoKhoNhan}${element.maNganKhoNhan}`
          }
        });
        this.dataTableView = this.buildTableView(this.dataTable)
        console.log('phieuKiemTraChatLuongService', this.dataTableView)
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

  async openDialogQD(row) {
    this.modal.create({
      nzTitle: 'Thông tin quyết định điều chuyển',
      nzContent: ThongTinQuyetDinhDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.qdinhDccId
      },
    });
  }

  async openDialogBBBQLD(row) {
    this.modal.create({
      nzTitle: 'Thông tin biên bản nghiệm thu bảo quản lần đầu',
      nzContent: ThongTinBienBanNghiemThuBaoQuanLanDauComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        loaiDc: this.loaiDc,
        isView: true,
        idInput: row.bbntLdId
      },
    });
  }

  buildTableView(data: any[] = []) {
    let dataView = chain(data)
      .groupBy("soQdinh")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maKhoXuat")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maDiemKhoNhan")
              ?.map((value3, key3) => {

                const children3 = chain(value3).groupBy("maloNganKhoNhan")
                  ?.map((m, im) => {

                    const maChiCucNhan = m.find(f => f.maloNganKhoNhan == im);
                    // const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
                    // if (!hasMaDiemKhoNhan) return {
                    //   ...maChiCucNhan
                    // }

                    // const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                    //   const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                    //   return {
                    //     ...maDiemKhoNhan,
                    //     children: n
                    //   }
                    // }).value()
                    return {
                      ...maChiCucNhan,
                      children: m
                    }
                  }).value()

                const row3 = value3.find(s => s?.maDiemKhoNhan == key3);
                return {
                  ...row3,
                  idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: children3,
                }
              }
              ).value();

            let row2 = value2?.find(s => s.maKhoXuat == key2);

            return {
              ...row2,
              idVirtual: row2 ? row2.idVirtual ? row2.idVirtual : uuidv4.v4() : uuidv4.v4(),
              children: children2,
            }
          }
          ).value();


        let row1 = value1?.find(s => s.soQdinh === key1);
        return {
          ...row1,
          idVirtual: row1 ? row1.idVirtual ? row1.idVirtual : uuidv4.v4() : uuidv4.v4(),
          children: children1,
          expand: true
        };
      }).value();

    return dataView
  }

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        if (this.formData.value.tuNgayLapPhieu) {
          this.formData.value.tuNgayLapPhieu = dayjs(this.formData.value.tuNgayLapPhieu).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayLapPhieu) {
          this.formData.value.denNgayLapPhieu = dayjs(this.formData.value.denNgayLapPhieu).format('YYYY-MM-DD')
        }
        if (this.formData.value.tuNgayGiamDinh) {
          this.formData.value.tuNgayGiamDinh = dayjs(this.formData.value.tuNgayGiamDinh).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayGiamDinh) {
          this.formData.value.denNgayGiamDinh = dayjs(this.formData.value.denNgayGiamDinh).format('YYYY-MM-DD')
        }

        let body = this.formData.value;
        // if (this.formData.value.ngayDuyetTc) {
        //   body.ngayDuyetTcTu = body.ngayDuyetTc[0];
        //   body.ngayDuyetTcDen = body.ngayDuyetTc[1];
        // }
        // if (this.formData.value.ngayHieuLuc) {
        //   body.ngayHieuLucTu = body.ngayHieuLuc[0];
        //   body.ngayHieuLucDen = body.ngayHieuLuc[1];
        // }
        this.phieuKiemTraChatLuongService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-phieu-kiem-tra-chat-luong.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  add(data: any) {
    this.data = data;
    this.selectedId = 0
    this.isDetail = true;
    this.isView = false;
  }

  xoa(data: any) {
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
            id: data.id
          };
          this.phieuKiemTraChatLuongService.delete(body).then(async () => {
            await this.timKiem();
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

  redirectDetail(id, b: boolean) {
    this.data = null
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }

  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }

}
