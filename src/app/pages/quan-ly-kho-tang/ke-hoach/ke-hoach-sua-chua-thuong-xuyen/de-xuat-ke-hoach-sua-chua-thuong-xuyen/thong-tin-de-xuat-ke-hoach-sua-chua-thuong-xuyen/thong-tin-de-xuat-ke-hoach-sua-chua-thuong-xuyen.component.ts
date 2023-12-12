import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {v4 as uuidv4} from "uuid";
import {
  DeXuatScThuongXuyenService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {MESSAGE} from "../../../../../../constants/message";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {chain} from "lodash";
import {
  DialogThemMoiKehoachDanhmucChitietComponent
} from "./dialog-them-moi-kehoach-danhmuc-chitiet/dialog-them-moi-kehoach-danhmuc-chitiet.component";
import {STATUS} from "../../../../../../constants/status";
import {DM_SC_TYPE} from "../../../../../../constants/config";
import {
  DanhMucSuaChuaService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {FILETYPE} from "../../../../../../constants/fileType";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";

@Component({
  selector: 'app-thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen',
  templateUrl: './thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.scss']
})
export class ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  rowItem: KeHoachDmChiTiet = new KeHoachDmChiTiet();
  rowItemCha: KeHoachDmChiTiet = new KeHoachDmChiTiet();
  listKhoi: any[] = [];
  listDmSuaChua: any[] = [];
  dataTableRes: any[] = [];
  listFile: any[] = []
  suffixCv : string
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
    private danhMucService: DanhMucService,
    private danhMucSuaChuaService: DanhMucSuaChuaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatScThuongXuyenService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      maDviDeXuat: [this.userInfo.MA_DVI],
      tenDviDeXuat: [this.userInfo.TEN_DVI],
      namKh: [dayjs().get('year'), Validators.required],
      ngayKy: [null],
      soCv: [null],
      trichYeu: [null, Validators.required],
      ngayDuyet: [null],
      lyDoTuChoi: [null],
      trangThai: [STATUS.DU_THAO],
      trangThaiTh: [STATUS.CHUA_TONG_HOP],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      listKtKhDxkhScThuongXuyenDtl: null
    });
  }


  async ngOnInit() {
    console.log(this.userInfo,1211)
    this.suffixCv = "/" + this.userInfo.MA_TCKT;
    await this.spinner.show();
    try {
      this.getDsKhoi();
      await this.getDmSuaChuaThuongXuyen(dayjs().get('year'));
      if (this.idInput) {
        await this.detail(this.idInput);
      }
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.deXuatScThuongXuyenService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.suffixCv = data.soCv ? "/" + data.soCv.split('/')[1] : "/" + this.userInfo.MA_TCKT;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soCv: data.soCv ? data.soCv.split('/')[0] : null,
            ngayDuyet: data.trangThai == STATUS.DA_DUYET_LDC ? dayjs().format('YYYY-MM-DDTHH:mm:ss') : data.ngayDuyet,
          })
          data.fileDinhKems.forEach(item => {
            if (item.fileType == FILETYPE.FILE_DINH_KEM) {
              this.listFileDinhKem.push(item)
            } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
              this.listCcPhapLy.push(item)
            }
          })
          this.listFile = data.fileDinhKems;
          this.dataTable = data.listKtKhDxkhScThuongXuyenDtl;
          this.convertListData();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async getDsKhoi() {
    let res = await this.danhMucService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKhoi = res.data;
    }
  }

  async getDmSuaChuaThuongXuyen(namKh) {
    let body = {
      "type": DM_SC_TYPE.SC_THUONG_XUYEN,
      "maDvi": this.userInfo.MA_DVI,
      "namKh": namKh,
      "trangThai" : STATUS.CHUA_THUC_HIEN,
      "paggingReq": {"limit": 10000, "page": 0}
    }
    let res = await this.danhMucSuaChuaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmSuaChua = res.data.content;
    }
  }

  addNewItemDetail(data: any, type: string, idx: number, list?: any) {
    if (!this.isViewDetail) {
      let modalQD = this.modal.create({
        nzTitle: type == "them" ? "Thêm mới kế hoạch, danh mục chi tiết" : "Chỉnh sửa kế hoạch, danh mục chi tiết",
        nzContent: DialogThemMoiKehoachDanhmucChitietComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1000px",
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          listDmSuaChua: (this.listDmSuaChua && this.listDmSuaChua.length > 0) ? this.listDmSuaChua.filter(item => (item.trangThai == STATUS.CHUA_THUC_HIEN) && item.khoi == data.khoi) : [],
          dataHeader: this.formData.value,
        }
      });
      modalQD.afterClose.subscribe(async (detail) => {
        if (detail) {
          if (!data.dataChild) {
            data.dataChild = [];
          }
          if (!data.idVirtual) {
            data.idVirtual = uuidv4();
          }
          if (type == "them") {
            data.dataChild.push(detail);
          } else {
            if (list) {
              Object.assign(list.dataChild[idx], detail);
            }
          }
          this.expandAll();
        }
      });
    }
  }

  convertListData() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable = chain(this.dataTable).groupBy("khoi").map((value, key) => ({
          khoi: key,
          tenKhoi: value[0].tenKhoi,
          dataChild: value,
          idVirtual: uuidv4()
        })
      ).value();
    }
    this.expandAll();
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    if (isGuiDuyet && this.idInput > 0) {
      this.setValidators();
    }
    this.conVertTreToList();
    let body = this.formData.value;
    body.soCv = body.soCv ? body.soCv + this.suffixCv : this.suffixCv;
    body.listKtKhDxkhScThuongXuyenDtl = this.dataTableRes;
    body.maDvi = this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi;
    this.listFile = [];
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCcPhapLy.length > 0) {
      this.listCcPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    if (this.listFile && this.listFile.length > 0) {
      this.formData.value.fileDinhKems = this.listFile;
    }
    body.fileDinhKems = this.listFile;
    let res = await this.createUpdate(body);
    if (res) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.id,
          trangThai: res.trangThai
        });
        this.duyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.idInput = res.id
          this.formData.patchValue({
            id: res.id,
            trangThai: res.trangThai
          });
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  // guiDuyet() {
  //   this.modal.confirm({
  //     nzClosable: false,
  //     nzTitle: "Xác nhận",
  //     nzContent: "Bạn có chắc chắn muốn gửi duyệt?",
  //     nzOkText: "Đồng ý",
  //     nzCancelText: "Không",
  //     nzOkDanger: true,
  //     nzWidth: 310,
  //     nzOnOk: async () => {
  //       this.spinner.show();
  //       try {
  //         let trangThai;
  //         switch (this.formData.value.trangThai) {
  //           case STATUS.DU_THAO :
  //           case STATUS.TU_CHOI_TP :
  //           case STATUS.TU_CHOI_LDC:
  //           case STATUS.TU_CHOI_CBV : {
  //             trangThai = STATUS.CHO_DUYET_TP;
  //             break;
  //           }
  //           case STATUS.TU_CHOI_LDC : {
  //             trangThai = STATUS.CHO_DUYET_LDC;
  //             break;
  //           }
  //         }
  //         let body = {
  //           id: this.formData.get("id").value,
  //           lyDo: null,
  //           trangThai: trangThai
  //         };
  //         let res =
  //           await this.deXuatScThuongXuyenService.approve(
  //             body
  //           );
  //         if (res.msg == MESSAGE.SUCCESS) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.GUI_DUYET_SUCCESS);
  //           this.quayLai();
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, res.msg);
  //         }
  //         this.spinner.hide();
  //       } catch (e) {
  //         console.log("error: ", e);
  //         this.spinner.hide();
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       }
  //     }
  //   });
  // }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1000px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.DA_DUYET_LDC: {
              trangThai = STATUS.TU_CHOI_CBV;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDo: text,
            trangThai: trangThai
          };
          const res = await this.deXuatScThuongXuyenService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  duyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.TU_CHOI_TP:
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_CBV :
            case STATUS.DU_THAO: {
              trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC : {
              trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
            case STATUS.DA_DUYET_LDC : {
              trangThai = STATUS.DA_DUYET_CBV;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai,
            ngayDuyet: this.formData.value.ngayDuyet
          };
          let res =
            await this.deXuatScThuongXuyenService.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.formData.controls["soCv"].setValidators(Validators.required);
    this.formData.controls["trichYeu"].setValidators(Validators.required);
    this.formData.controls["ngayKy"].setValidators(Validators.required);
    if (this.formData.value.trangThai == STATUS.DA_DUYET_LDC) {
      this.formData.controls["ngayDuyet"].setValidators(Validators.required);
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(s => {
        this.expandSet.add(s.idVirtual);
      });
    }
  }

  conVertTreToList() {
    let arr = [];
    this.dataTable.forEach(item => {
      if (item.dataChild && item.dataChild.length > 0) {
        item.dataChild.forEach(data => {
          arr.push(data);
        });
      }
    });
    this.dataTableRes = arr;
  }

  addNewKhoi() {
    if (!this.rowItemCha.khoi) {
      this.notification.error(MESSAGE.ERROR, "Chưa chọn danh mục khối");
      return;
    }
    if (this.checkExitsData(this.rowItemCha, this.dataTable)) {
      this.notification.error(MESSAGE.ERROR, "Không được chọn trùng danh mục khối");
      return;
    }
    let itemKhoi = this.listKhoi.find(item => item.ma == this.rowItemCha.khoi);
    if (itemKhoi) {
      this.rowItemCha.tenKhoi = itemKhoi.giaTri;
    }
    this.rowItemCha.idVirtual = uuidv4();
    this.dataTable.push(this.rowItemCha);
    this.rowItemCha = new KeHoachDmChiTiet();
  }

  sumSoLuong(data
               :
               any, row
               :
               string, type ?: any
  ) {
    let sl = 0;
    if (!type) {
      if (data && data.dataChild && data.dataChild.length > 0) {
        const sum = data.dataChild.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        let sum = 0;
        this.dataTable.forEach(item => {
          sum += this.sumSoLuong(item, row);
        });
        sl = sum;
      }
    }
    return sl;
  }

  deleteItemCha(idx) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(idx, 1);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  deleteItem(index
               :
               any, y
               :
               any
  ) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          if (this.dataTable && this.dataTable.length > 0 && this.dataTable[index]) {
            if (this.dataTable[index] && this.dataTable[index].dataChild && this.dataTable[index].dataChild[y]) {
              this.dataTable[index].dataChild.splice(y, 1);
            }
          }
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  checkExitsData(item, dataItem)
    :
    boolean {
    let rs = false;
    if (dataItem && dataItem.length > 0) {
      dataItem.forEach(it => {
        if (it.khoi == item.khoi) {
          rs = true;
          return;
        }
      });
    }
    return rs;
  }
}

export class KeHoachDmChiTiet {
  id: number;
  idVirtual: any
  khoi: string;
  tenKhoi: string;
}
