import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { cloneDeep } from "lodash";

import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DatePipe } from '@angular/common';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {STATUS} from "../../../../../constants/status";
import {
  QuyetDinhPheDuyetKeHoachNhapKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhPheDuyetKeHoachNhapKhac.service";
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import {FILETYPE} from "../../../../../constants/fileType";
import {DxKhNhapKhacService} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/dxKhNhapKhac.service";
import {
  TongHopDxKhNhapKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/tongHopDxKhNhapKhac.service";

@Component({
  selector: 'app-themmoi-quyet-dinh-pd-khnk',
  templateUrl: './themmoi-quyet-dinh-pd-khnk.component.html',
  styleUrls: ['./themmoi-quyet-dinh-pd-khnk.component.scss']
})
export class ThemmoiQuyetDinhPdKhnkComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() idTh: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() isView: boolean;
  formData: FormGroup;
  formThongTinChung: FormGroup;

  selectedCanCu: any = {};
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];
  listFileDinhKem: FileDinhKem[] = [];
  listCanCuPhapLy: FileDinhKem[] = [];
  listFile: any[] = []
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  dsDxTaoQd: any;
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;
  isQuyetDinh: boolean = false;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  danhMucDonVi: any;
  danhsachDx: any[] = [];
  danhsachDxCache: any[] = [];

  iconButtonDuyet: string;
  titleButtonDuyet: string;
  dataChiTieu: any;
  listNam: any[] = [];
  yearNow: number = 0;

  listOfData: any[] = [];


  STATUS = STATUS
  selected: boolean = false;

  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  isCheckCreate: boolean = true
  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachNhapKhacService: QuyetDinhPheDuyetKeHoachNhapKhacService,
    private tongHopDxKhNhapKhacService: TongHopDxKhNhapKhacService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dxKhNhapKhacService: DxKhNhapKhacService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get('year'), Validators.required],
      soQd: ['',],
      ngayKyQd: ['',],
      ngayHieuLuc: ['',],
      idTh: [''],
      maTh: [''],
      idDx: [''],
      soDxuat: [''],
      trichYeu: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: [''],
      ghiChu: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      phanLoai: ['', [Validators.required]],
      tgianThien: [null],
      tenKieuNx: [null],
      tenLoaiHinhNx: [null],
      kieuNx: [null],
      maDvi: [null],
      dvt: [null],
      ngayPduyet: [null],
      tongThanhTien: [null],
      lastest: [''],
      tongSlNhap: [''],
      noiDung: [''],
      loaiHinhNx: [null]
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHieuLuc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayKyQd"].clearValidators();
      this.formData.controls["ngayHieuLuc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idTh"].setValidators([Validators.required]);
      this.formData.controls["soDxuat"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idTh"].clearValidators();
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    }
  }

  isValidate(data: any) {
    let shouldStop = false;
    data.forEach(item => {
      item.children.forEach(res => {
        res.children.forEach(elm => {
          elm.children.forEach(i => {
            if (i.soLuong > res.soLuong) {
              this.notification.error(MESSAGE.ERROR, "Số lượng của Điểm kho không được lớn hơn số lượng gói thầu");
              shouldStop = true;
              return;
            }
          });
          if (shouldStop) {
            return;
          }
        });
        if (shouldStop) {
          return;
        }
      });
      if (shouldStop) {
        return;
      }
    });
    return !shouldStop;
  }


  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_NK_QDNH_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maQd = this.userInfo.MA_QD;
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') + i,
          text: dayjs().get('year') + i,
        });
      }
      debugger
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.getDataChiTieu(),
        this.listDsTongHopToTrinh(),
        this.bindingDataTongHop(this.dataTongHop),
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  initForm() {
    this.idInput = 0;
    this.formData.patchValue({
      namKhoach: dayjs().get('year'),
      phanLoai: this.loaiVthh == '02' ? 'TTr' : 'TH'
    })
  }

  async showFirstRow($event, dataGoiThau: any) {
    await this.showDetail($event, dataGoiThau);
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // phương thức đấu thầu
    this.listPhuongThucDauThau = [];
    let resPt = await this.danhMucService.danhMucChungGetAll('PT_DTHAU');
    if (resPt.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = resPt.data;
    }
    // hình thức đấu thầu
    this.listHinhThucDauThau = [];
    let resPtdt = await this.danhMucService.danhMucChungGetAll('HT_LCNT');
    if (resPtdt.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = resPtdt.data;
    }
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKhoach: +dataTongHop.namKhoach,
        idTh: dataTongHop.id,
        maTh: dataTongHop.maTh,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.listDsTongHopToTrinh();
      await this.selectMaTongHop(dataTongHop);
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }


  async listDsTongHopToTrinh() {
    await this.spinner.show();
    // Get data tổng hợp
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKhoach: this.formData.get('namKhoach').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDxKhNhapKhacService.dsThDuocTaoQDinhPduyet();
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data;
    }
    await this.spinner.hide();
  }

  async save(isGuiDuyet?) {
    debugger
    await this.spinner.show();
    // if (!this.isDetailPermission()) {
    //   return;
    // }
    this.setValidator(isGuiDuyet)
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    body.lastest = 0;
    body.details = this.danhsachDx;
    if (this.listFileDinhKem.length > 0) {
      this.listFileDinhKem.forEach(item => {
        item.fileType = FILETYPE.FILE_DINH_KEM
        this.listFile.push(item)
      })
    }
    if (this.listCanCuPhapLy.length > 0) {
      this.listCanCuPhapLy.forEach(element => {
        element.fileType = FILETYPE.CAN_CU_PHAP_LY
        this.listFile.push(element)
      })
    }
    body.fileDinhKems = this.listFile;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get('id').setValue(res.data.id);
          if (this.formData.get('phanLoai').value == 'TH') {
            this.formData.get('idTh').setValue(res.data.idTh);
          } else {
            this.formData.get('idDx').setValue(res.data.idDx);
          }
          this.idInput = res.data.id;
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
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
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDV:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDV;
        mesg = 'Văn bản sẵn sàng gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        trangThai = STATUS.BAN_HANH;
        mesg = 'Văn bản sẵn sàng ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mesg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          await this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          await this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  // convertListDataVT() {
  //   let listChild = [];
  //   this.listOfData.forEach(item => {
  //     item.children.forEach(i => {
  //       i.goiThau = item.goiThau
  //       listChild.push(i)
  //     })
  //   })
  //   this.helperService.setIndexArray(listChild);
  //   this.listDataGroup = chain(listChild).groupBy('tenDvi').map((value, key) => (
  //     {
  //       tenDvi: key,
  //       soLuongTheoChiTieu: value[0].soLuongTheoChiTieu,
  //       soLuong: null,
  //       sumThanhTienTamTinh: null,
  //       soLuongDaMua: value[0].soLuongDaMua,
  //       dataChild: value
  //     })).value()
  //   this.listDataGroup.forEach(item => {
  //     let sluong = 0;
  //     let sumThanhTienTamTinh = 0;
  //     item.dataChild.forEach(i => {
  //       sluong = sluong + i.soLuong
  //       sumThanhTienTamTinh = sumThanhTienTamTinh + i.soLuong * (i.donGiaTamTinh ? i.donGiaTamTinh : i.donGia)
  //     })
  //     item.soLuong = sluong;
  //     item.sumThanhTienTamTinh = sumThanhTienTamTinh;
  //   })
  //   console.log(this.listDataGroup)
  //   this.sumThanhTien()
  // }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.getDetail(id);
      this.listDanhSachTongHop = [];
      const data = res.data;
      if (data?.fileDinhKems?.length > 0) {
        data.fileDinhKems.forEach(item => {
          if (item.fileType == FILETYPE.FILE_DINH_KEM) {
            this.listFileDinhKem.push(item)
          } else if (item.fileType == FILETYPE.CAN_CU_PHAP_LY) {
            this.listCanCuPhapLy.push(item)
          }
        })
      }
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
      });
      if (!data.idTh) {
        this.danhsachDx.push(data);
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        for (const item of this.danhsachDxCache) {
          await this.dxKhNhapKhacService.getDetail(item.idDx).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.details = res.data.dtl;
            }
          })
        }
      } else {
        this.danhsachDx = data.children;
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.danhsachDxCache.forEach(item => {
          this.dxKhNhapKhacService.getDetail(item.id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.details = res.data.dtl;
            }
          })
        })
      }
      await this.showFirstRow(event, this.danhsachDx[0]);
    }
  }

  async getDataChiTieu() {
    let res2 = null;
      res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
        +this.formData.get('namKhoach').value,
      );
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      // this.formData.patchValue({
      //   soQd: this.dataChiTieu.soQuyetDinh
      // });
    }
  }


  // sumThanhTien() {
  //   var sum = 0;
  //   var sumSl = 0;
  //   this.danhsachDx.forEach(item => {
  //     item.dataChild.forEach(res => {
  //         sum += (res.donGiaTamTinh != null ?
  //           res.donGiaTamTinh * res.soLuong : (res.donGiaVat != null ? res.donGiaVat *
  //             res.soLuong : (res.donGia != null ? res.donGia * res.soLuong : 0)));
  //         sumSl += res.soLuong;
  //     })
  //     item.soLuong += sumSl
  //   })
  //   this.formData.get('tongMucDtDx').setValue(sum);
  //   this.formData.get('soLuong').setValue(sumSl);
  // }

  openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Mã tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['maTh', 'noiDungTh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data);
      }
    });
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const data = event;
      console.log(data, "0000000")
      this.formData.patchValue({
        loaiVthh: data.dxHdr[0].loaiVthh,
        tenLoaiVthh: data.dxHdr[0].tenLoaiVthh,
        tenLoaiHinhNx: data.dxHdr[0].tenLoaiHinhNx,
        loaiHinhNx: data.dxHdr[0].loaiHinhNx,
        tenKieuNx: data.dxHdr[0].tenKieuNx,
        kieuNx: data.dxHdr[0].kieuNx,
        idTh: data.id,
        maTh: data.maTh,
        noiDung: data.noiDungTh,
        idDx: null,
        soTrHdr: null,
        dvt: data.dvt
      })
      this.danhsachDx = data.dxHdr;
      this.danhsachDxCache = cloneDeep(this.danhsachDx);
      this.dataInput = null;
      this.dataInputCache = null;
      await this.calTongSlNhap();
      await this.showFirstRow(Event, this.danhsachDx[0]);

    }
    await this.spinner.hide()
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();

    let res = await this.dxKhNhapKhacService.dsDxDuocTaoQDinhPDuyet();
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDxTaoQd = res.data;
      console.log(this.dsDxTaoQd, "this.dsDxTaoQd")
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch nhập khác',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsDxTaoQd,
        dataHeader: ['Số công văn tờ trình', 'Loại hàng DTQG', 'Ngày phê duyệt'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'ngayPduyet']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.onChangeIdTrHdr(data);
      }
    });
  }

  async onChangeIdTrHdr(data) {
    await this.spinner.show();
    this.danhsachDx = [];
    if (data) {
        const dataRes = data.hdr;
        let tongMucDt = 0
        // dataRes.idDxHdr = data.hdr.id;
        if (data.dtl) {
          dataRes.details = data.dtl
        };
        this.danhsachDx.push(dataRes);
        this.formData.patchValue({
          cloaiVthh: data.hdr.cloaiVthh,
          tenCloaiVthh: data.hdr.tenCloaiVthh,
          loaiVthh: data.hdr.loaiVthh,
          tenLoaiVthh: data.hdr.tenLoaiVthh,
          trichYeu: data.hdr.trichYeu,
          tgianBdauTchuc: data.hdr.tgianBdauTchuc,
          ngayPduyet: data.hdr.ngayPduyet,
          dvt: data.hdr.dvt,
          tongThanhTien: data.hdr.tongThanhTien,
          tgianMthau: data.hdr.tgianMthau,
          tgianDthau: data.hdr.tgianDthau,
          tgianThien: data.hdr.tgianThien,
          maDvi: data.hdr.maDviDxuat,
          idTh: null,
          maTh: null,
          soDxuat: data.hdr.soDxuat,
          tongMucDt: tongMucDt,
          kieuNx: data.hdr.kieuNx,
          tenKieuNx: data.hdr.tenKieuNx,
          tenLoaiHinhNx: data.hdr.tenLoaiHinhNx,
          loaiHinhNx: data.hdr.loaiHinhNx
        })
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;
      await this.calTongSlNhap();
      await this.showFirstRow(Event, this.danhsachDx[0]);
    }
    await this.spinner.hide();
  }

  index = 0;
  async showDetail($event, index) {
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[index];
      this.dataInputCache = this.danhsachDxCache[index];
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      this.dataInputCache = this.danhsachDxCache[0];
      this.index = 0;
      await this.spinner.hide();
    }
  }

  async calTongSlNhap() {
    if (this.danhsachDx) {
      let sum = 0
      this.danhsachDx.forEach(item => {
        sum += item.tongSlNhap;
      })
      this.formData.patchValue({
        tongSlNhap: sum,
      })
    }
  }

  setNewSoLuong($event) {
    this.danhsachDx[this.index].soLuong = $event;
  }

  setNewDonGiaTamTinh($event) {
    this.danhsachDx[this.index].tongTien = $event;
  }

  setNewDate($event) {
    let pipe = new DatePipe('en-US');
    this.formData.get('tgianBdauTchuc').setValue($event.tgianBdauTchuc);
    this.formData.get('tgianMthau').setValue(pipe.transform($event.tgianMthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianDthau').setValue(pipe.transform($event.tgianDthau, 'yyyy-MM-dd HH:mm'));
    this.formData.get('tgianNhang').setValue($event.tgianNhang);
    // this.danhsachDx[this.index].tgianBdauTchuc = $event.tgianBdauTchuc;
    // this.danhsachDx[this.index].tgianMthau = $event.tgianMthau;
    // this.danhsachDx[this.index].tgianDthau = $event.tgianDthau;
    // this.danhsachDx[this.index].tgianNhang = $event.tgianNhang;
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  themMoiGoiThau(data?: any, index?: number) {
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.NOTIFICATION, "Vui lòng chọn loại hàng hóa");
      return;
    }
    const modal = this.modal.create({
      nzTitle: 'Địa điểm nhập hàng',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        dviTinh: this.formData.get('loaiVthh').value.maDviTinh,
        namKeHoach: this.formData.value.namKhoach,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        if (index >= 0) {
          this.danhsachDx[index] = res;
        } else {
          this.danhsachDx.push(res);
        }
        let tongMucDt: number = 0;
        this.danhsachDx.forEach((item) => {
          tongMucDt = tongMucDt + item.soLuong * item.donGiaTamTinh;
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt,
        });
      }
    });
  }

  deleteRow(data: any) {
    for (let index = 0; index < this.danhsachDx.length; index++) {
      for (let y = 0; y < this.danhsachDx[index].children.length; y++) {
        for (let k = 0; k < this.danhsachDx[index].children[y].children.length; k++) {
          for (let q = 0; q < this.danhsachDx[index].children[y].children[k].children.length; q++) {
            if (this.danhsachDx[index].children[y].children[k].children[q].id == data.id) {
              this.danhsachDx[index].children[y].children[k].children = this.danhsachDx[index].children[y].children[k].children.filter(d => d.id !== data.id);
            }
          }
        }
      }
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }


  expandSet3 = new Set<number>();
  onExpandChange3(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet3.add(id);
    } else {
      this.expandSet3.delete(id);
    }
  }


  async taoQdinh() {
    // let elem = document.getElementById('mainTongCuc');
    // let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    // tabActive.classList.remove('ant-menu-item-selected')
    // let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    // setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  showTongHop() {
    this.loadChiTiet(this.idInput)
    // let elem = document.getElementById('mainTongCuc');
    // let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    // tabActive.classList.remove('ant-menu-item-selected')
    // let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    // setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
  }

}
