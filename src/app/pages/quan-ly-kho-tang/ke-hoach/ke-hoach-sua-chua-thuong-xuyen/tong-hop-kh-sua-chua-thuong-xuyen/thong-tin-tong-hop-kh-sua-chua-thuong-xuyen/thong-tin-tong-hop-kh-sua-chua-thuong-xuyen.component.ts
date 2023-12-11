import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserLogin} from "../../../../../../models/userlogin";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeHoachXayDungTrungHan} from "../../../../../../models/QuyHoachVaKeHoachKhoTang";
import {Router} from "@angular/router";
import {chain} from "lodash";
import {v4 as uuidv4} from "uuid";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UserService} from "../../../../../../services/user.service";
import {Globals} from "../../../../../../shared/globals";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../../constants/message";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {STATUS} from 'src/app/constants/status';
import {
  DeXuatScThuongXuyenService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {
  DialogThemMoiKehoachDanhmucChitietComponent
} from "../../de-xuat-ke-hoach-sua-chua-thuong-xuyen/thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen/dialog-them-moi-kehoach-danhmuc-chitiet/dialog-them-moi-kehoach-danhmuc-chitiet.component";
import {DM_SC_TYPE} from "../../../../../../constants/config";
import {
  DanhMucSuaChuaService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {FILETYPE} from "../../../../../../constants/fileType";
import {
  TongHopScThuongXuyenService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/tong-hop-sc-thuong-xuyen.service";
import {ThongTu1452013Service} from "../../../../../../services/bao-cao/ThongTu1452013.service";
import {
  ReportKhScThuongXuyenService
} from "../../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/report-kh-sc-thuong-xuyen.service";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-thong-tin-tong-hop-kh-sua-chua-thuong-xuyen',
  templateUrl: './thong-tin-tong-hop-kh-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./thong-tin-tong-hop-kh-sua-chua-thuong-xuyen.component.scss']
})
export class ThongTinTongHopKhSuaChuaThuongXuyenComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() isViewQd: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Input() isApprove: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  expandSet = new Set<number>();
  userInfo: UserLogin;
  formData: FormGroup;
  listDmSuaChua: any[] = [];
  listDx: any[] = [];
  itemSelected: any;
  dataTable: any[] = [];
  dataTableReq: any[] = [];
  dataTableDx: any[] = [];
  dataTableDxAll: any[] = [];
  dsCuc: any[] = [];
  dsChiCuc: any[] = [];
  rowItem: KeHoachXayDungTrungHan = new KeHoachXayDungTrungHan();
  dataEdit: { [key: string]: { edit: boolean; data: KeHoachXayDungTrungHan } } = {};
  isTongHop: boolean = false;
  listNam: any[] = [];
  listCcPhapLy: any[] = [];
  listFileDinhKem: any[] = [];
  listLoaiDuAn: any[] = [];
  STATUS = STATUS;
  maTt: string;
  soQd: string;
  isEdit: string = "";
  listFile: any[] = []
  pdfBlob: any;
  pdfSrc: any;
  excelBlob: any;
  excelSrc: any
  showDlgPreview = false;

  ncKhTongSoEdit: number;
  ncKhNstwEdit: number;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private tongHopDxScThuongXuyen: TongHopScThuongXuyenService,
    private reportKhScThuongXuyenService: ReportKhScThuongXuyenService,
    private deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
    private danhMucSuaChuaService: DanhMucSuaChuaService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      ngayTaoTt: [null],
      thoiGianTh: [null],
      namKh: [dayjs().get("year")],
      noiDungTh: [null],
      soToTrinh: [null, Validators.required],
      soQuyetDinh: [null],
      ngayKy: [null],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ["Dự thảo"],
      loai: ["00", Validators.required],
      lyDoTuChoi: []
    });
  }

  async ngOnInit() {
    console.log(this.isTongHop, "isTongHop")
    console.log(this.isViewDetail, "isViewDetail")
    console.log(this.isViewQd, "isViewQd")
    this.userInfo = this.userService.getUserLogin();
    this.maTt = "/TTr-TCDT";
    this.soQd = "/QĐ-TCDT";
    this.loadDsNam();
    await this.getDmSuaChuaThuongXuyen();
    await this.getDataDetail(this.idInput);
    await this.getAllLoaiDuAn();
  }

  loadDsNam() {
    for (let i = -10; i < 10; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  async getAllLoaiDuAn() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiDuAn = res.data;
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      this.isTongHop = true;
      let res = await this.tongHopDxScThuongXuyen.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.helperService.bidingDataInFormGroup(this.formData, data);
        this.formData.patchValue({
          soToTrinh: data.soToTrinh ? data.soToTrinh.split('/')[0] : null,
          soQuyetDinh: data.soQuyetDinh ? data.soQuyetDinh.split('/')[0] : null,
        })
        data.fileDinhKems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.listFileDinhKem.push(item)
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCcPhapLy.push(item)
          }
        })
        this.listFile = data.fileDinhKems;
        this.dataTableReq = data.listKtKhThkhScThuongXuyenDtl;
        this.listDx = data.listDx;
        this.listDx.forEach(item => {
          if (item.listKtKhDxkhScThuongXuyenDtl && item.listKtKhDxkhScThuongXuyenDtl.length > 0) {
            item.listKtKhDxkhScThuongXuyenDtl.forEach(itChild => {
              itChild.id = null;
              this.dataTableDxAll.push(itChild);
            })
          }
        })
        if (this.listDx && this.listDx.length > 0) {
          this.selectRow(this.listDx[0]);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } else {
      this.formData.patchValue({
        ngayTaoTt: new Date()
      })
    }
  }


  quayLai() {
    this.showListEvent.emit();
  }

  setValidators() {
    this.helperService.removeValidators(this.formData)
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV) {
      this.formData.controls["soToTrinh"].setValidators([Validators.required]);
    }
    if (this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) {
      this.formData.controls["soQuyetDinh"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
    }
  }


  async save(isGuiDuyet?) {
    this.spinner.show();
    if (isGuiDuyet && this.idInput > 0) {
      this.setValidators();
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.thoiGianTh = body.thoiGianTh ? dayjs(body.thoiGianTh) : null;
    body.soToTrinh = body.soToTrinh ? body.soToTrinh + this.maTt : null;
    body.soQuyetDinh = body.soQuyetDinh ? body.soQuyetDinh + this.soQd : null;
    body.listKtKhThkhScThuongXuyenDtl = this.dataTableReq;
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
    //check detail pa của tổng cục
    if (!body.listKtKhThkhScThuongXuyenDtl || body.listKtKhThkhScThuongXuyenDtl.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Chưa có phương án của tổng cục.");
    }
    body.maDvi = this.userInfo.MA_DVI;
    let res;
    if (this.idInput > 0) {
      res = await this.tongHopDxScThuongXuyen.update(body);
    } else {
      res = await this.tongHopDxScThuongXuyen.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        });
        this.guiDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.idInput = res.data.id;
          this.formData.patchValue({
            id: res.data.id,
            trangThai: res.data.trangThai
          });
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? "Bạn có chắc chắn muốn duyệt?" : "Bạn có chắc chắn muốn gửi duyệt?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.DU_THAO: {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.TU_CHOI_LDV: {
              trangThai = STATUS.CHO_DUYET_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.TU_CHOI_LDTC: {
              trangThai = STATUS.CHO_DUYET_LDTC;
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.DA_DUYET_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.get("id").value,
            lyDo: null,
            trangThai: trangThai
          };
          let res =
            await this.tongHopDxScThuongXuyen.approve(
              body
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, (this.formData.value.trangThai == STATUS.CHO_DUYET_LDV || this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC) ? MESSAGE.PHE_DUYET_SUCCESS : MESSAGE.GUI_DUYET_SUCCESS);
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


  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: "Từ chối",
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "900px",
      nzFooter: null,
      nzComponentParams: {}
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let trangThai;
          switch (this.formData.value.trangThai) {
            case STATUS.CHO_DUYET_LDV: {
              trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
            case STATUS.CHO_DUYET_LDTC: {
              trangThai = STATUS.TU_CHOI_LDTC;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDoTuChoi: text,
            trangThai: trangThai
          };
          const res = await this.tongHopDxScThuongXuyen.approve(body);
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

  async tongHop() {
    this.spinner.show();
    this.formData.patchValue({
      thoiGianTh: new Date()
    });
    let body = {
      "namKh": this.formData.value.namKh,
      "trangThai": STATUS.DA_DUYET_CBV,
      "trangThaiTh": STATUS.CHUA_TONG_HOP,
      "capDvi": 1,
      "paggingReq": {"limit": 10000, "page": 0}
    };
    let res = await this.deXuatScThuongXuyenService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDx = [];
      this.dataTableDx = [];
      this.dataTableDxAll = [];
      this.dataTable = [];
      this.dataTableReq = [];
      let listDataDx = res.data;
      console.log(listDataDx,"let listDataDx")
      if (listDataDx && listDataDx.content.length > 0) {
        this.isTongHop = true;
        this.listDx = listDataDx.content;
        this.listDx.forEach(item => {
          if (item.listKtKhDxkhScThuongXuyenDtl && item.listKtKhDxkhScThuongXuyenDtl.length > 0) {
            item.listKtKhDxkhScThuongXuyenDtl.forEach(itChild => {
              itChild.id = null;
              itChild.idHdrDx = item.id;
              this.dataTableDxAll.push(itChild);
              this.dataTableReq.push(itChild);
            })
          }
        })
        if (this.listDx && this.listDx.length > 0) {
          this.selectRow(this.listDx[0]);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, "Không tìm thấy dữ liệu đề xuất!");
        this.isTongHop = false;
        this.spinner.hide();
        return;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  async getDmSuaChuaThuongXuyen() {
    let body = {
      "type": DM_SC_TYPE.SC_THUONG_XUYEN,
      "namKh": this.formData.value.namKh,
      "paggingReq": {"limit": 10000, "page": 0}
    }
    let res = await this.danhMucSuaChuaService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDmSuaChua = res.data.content
    }
  }

  selectRow(item: any) {
    this.dataTableDx = [];
    this.itemSelected = item;
    this.dataTable = [];
    this.listDx.forEach(item => {
      item.selected = false;
    });
    item.selected = true;
    //list dx
    if (this.dataTableDxAll && this.dataTableDxAll.length > 0) {
      let arr = this.dataTableDxAll.filter(data => data.idHdr == item.id);
      if (arr && arr.length > 0) {
        this.dataTableDx = arr;
        this.dataTableDx = this.convertListData(this.dataTableDx);
        this.expandAll(this.dataTableDx);
      }
    }
    // phg án tổng cục
    if (!this.idInput) {
      //th tổng hợp
      this.dataTable = this.dataTableReq.filter(data => data.idHdr == item.id);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    } else {
      //th view detail tổng hợp
      this.dataTable = this.dataTableReq.filter(data => data.idHdrDx == item.id);
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable = this.convertListData(this.dataTable);
        this.expandAll(this.dataTable);
      }
    }
  }

  updateItemDetail(data: any, type: string, idx: number, list?: any) {
    if (!this.isViewDetail || (this.isViewDetail && this.formData.value.trangThai == STATUS.CHO_DUYET_LDV) || (this.isViewDetail && this.formData.value.trangThai == STATUS.CHO_DUYET_LDTC)) {
      let modalQD = this.modal.create({
        nzTitle: "Chỉnh sửa kế hoạch, danh mục chi tiết",
        nzContent: DialogThemMoiKehoachDanhmucChitietComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: "1000px",
        nzFooter: null,
        nzComponentParams: {
          dataTable: list && list.dataChild ? list.dataChild : [],
          dataInput: data,
          type: type,
          typeKh: 'TH',
          listDmSuaChua: this.listDmSuaChua,
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
          if (list) {
            Object.assign(list[idx], detail);
          }
          this.expandAll(this.dataTable);
        }
      });
    }
  }

  expandAll(table: any[]) {
    if (table && table.length > 0) {
      table.forEach(s => {
        this.expandSet.add(s.idVirtual);
        if (s.dataChild && s.dataChild.length > 0) {
          s.dataChild.forEach(item => {
            this.expandSet.add(item.idVirtual);
          });
        }
      });
    }
  }


  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  convertListData(table: any[]) {
    if (table && table.length > 0) {
      table = chain(table)
        .groupBy("tenChiCuc")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("khoi")
            .map((v, k) => {
                return {
                  idVirtual: uuidv4(),
                  khoi: k,
                  tenKhoi: v[0].tenKhoi,
                  dataChild: v
                };
              }
            ).value();
          return {
            idVirtual: uuidv4(),
            tenChiCuc: key,
            dataChild: rs
          };
        }).value();
    }
    return table;
  }

  sumSoLuong(tenChiCuc: string, row: string, khoi: string) {
    let sl = 0;
    if (tenChiCuc && khoi) {
      let arr = this.dataTableReq.filter(item => item.tenChiCuc == tenChiCuc && item.khoi == khoi);
      if (arr && arr.length > 0) {
        const sum = arr.reduce((prev, cur) => {
          prev += cur[row];
          return prev;
        }, 0);
        sl = sum;
      }
    } else {
      let arr = this.dataTableReq.filter(item => item.tenDvi == this.itemSelected.tenDvi);
      const sum = arr.reduce((prev, cur) => {
        prev += cur[row];
        return prev;
      }, 0);
      sl = sum;
    }
    return sl;
  }

  editRow(idx, y, item) {
    this.isEdit = idx + "-" + y;
    this.ncKhTongSoEdit = item.ncKhTongSo;
    this.ncKhNstwEdit = item.ncKhNstw;
  }

  deleteRow(item) {
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
          this.dataTableReq = this.dataTableReq.filter(it => {
            return it.id != item.id;
          });
          this.selectRow(this.itemSelected);
        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  async preview() {
    try {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "th_kh_sua_chua_thuong_xuyen.jrxml";
      body.tenBaoCao = "Thông tin tổng hợp kế hoạch sửa chữa thường xuyên";
      await this.reportKhScThuongXuyenService.thKhSuaChuaTXuyen(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "th_kh_sua_chua_thuong_xuyen.pdf");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "th_kh_sua_chua_thuong_xuyen.jrxml";
      body.tenBaoCao = "Thông tin tổng hợp kế hoạch sửa chữa thường xuyên";
      await this.reportKhScThuongXuyenService.thKhSuaChuaTXuyen(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "th_kh_sua_chua_thuong_xuyen.xlsx");
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

  }

}
