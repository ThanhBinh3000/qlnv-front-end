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
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
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

@Component({
  selector: 'app-themmoi-quyet-dinh-pd-khnk',
  templateUrl: './themmoi-quyet-dinh-pd-khnk.component.html',
  styleUrls: ['./themmoi-quyet-dinh-pd-khnk.component.scss']
})
export class ThemmoiQuyetDinhPdKhnkComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
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
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
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
      ngayQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      idTrHdr: [''],
      soDx: [''],
      trichYeu: [''],
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      nguonVon: [''],
      tgianBdauTchuc: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: [''],
      ghiChu: [''],
      soQdCc: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DU_THAO],
      tchuanCluong: [''],
      tenTrangThai: ['Dự thảo'],
      ldoTuchoi: [''],
      phanLoai: ['', [Validators.required]],
      vat: ['5'],
      gtriDthau: [null,],
      gtriHdong: [null,],
      donGiaVat: [''],
      tongMucDt: [null,],
      dienGiai: [''],
      tenDvi: [''],
      tgianThien: [null],
      yKien: [''],
      idTh: [null],
      tenKieuNx: [null],
      tenLoaiNx: [null]
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQd"].setValidators([Validators.required]);
      this.formData.controls["ngayQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQd"].clearValidators();
      this.formData.controls["ngayQd"].clearValidators();
      this.formData.controls["ngayHluc"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TH') {
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
      this.formData.controls["soTrHdr"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'TTr') {
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
      this.formData.controls["soTrHdr"].setValidators([Validators.required]);
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
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {

  }

  async ngOnInit() {
    console.log(this.isView)
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
      if (this.idInput) {
        await this.loadChiTiet(this.idInput)
      } else {
        this.initForm();
      }
      await Promise.all([
        this.loadDataComboBox(),
        this.getDataChiTieu(),
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
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
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
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.listDsTongHopToTrinh();
      await this.selectMaTongHop(dataTongHop.id);
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
    let resTh = await this.tongHopDeXuatKHLCNTService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
    await this.spinner.hide();
  }

  async save(isGuiDuyet?) {
    await this.spinner.show();
    if (!this.isDetailPermission()) {
      return;
    }
    // this.setValidator(isGuiDuyet)
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    if (this.formData.value.soQd) {
      body.soQd = this.formData.value.soQd + "/" + this.maQd;
    }
    // body.ngayHluc = this.convertDateToString(body.ngayHluc)
    // body.ngayQd = this.convertDateToString(body.ngayQd)
    // this.danhsachDx.forEach(dtl =>{
    //   dtl.children.forEach(item =>{
    //     item.soDxuat = dtl.soDxuat
    //   })
    // })
    console.log(this.danhsachDx)
    body.children = this.danhsachDx;
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
    // if (await !this.isValidate(body.children)) {
    //   await this.spinner.hide();
    //   return;
    // }
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.formData.get('id').setValue(res.data.id);
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
    // Vật tư
    switch (this.formData.get('trangThai').value) {
      case STATUS.DU_THAO: {
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
      const dtl = null
      console.log("data:    ", data)
      this.listFileDinhKem = data.fileDinhKems;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
      });
      let tongMucDt = 0
      this.danhsachDx.push(data);
      this.danhsachDxCache = cloneDeep(this.danhsachDx);
      for (const item of this.danhsachDxCache) {
        await this.dxKhNhapKhacService.getDetail(item.idDx).then((res) => {
          console.log(res)
          if (res.msg == MESSAGE.SUCCESS) {
            item.children = res.data.dtl;
          }
        })
      }
      console.log("11", this.danhsachDx)
      await this.showFirstRow(event, this.danhsachDx[0]);
    }
    ;
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
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDung']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.selectMaTongHop(data.id);
      }
    });
  }

  async selectMaTongHop(event) {
    await this.spinner.show()
    if (event) {
      const res = await this.tongHopDeXuatKHLCNTService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          soQdCc: data.soQdCc,
          idThHdr: event,
          idTrHdr: null,
          soTrHdr: null,
        })
        this.danhsachDx = data.hhDxKhLcntThopDtlList;
        for (const item of this.danhsachDx) {
          await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.children = res.data.dsGtDtlList;
            }
          })
        };
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide()
  }

  async openDialogTr() {
    if (this.formData.get('phanLoai').value != 'TTr') {
      return
    }
    await this.spinner.show();

    let res = await this.dxKhNhapKhacService.dsDxDuocTaoQDinhPDuyet();
    console.log(res)
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDxTaoQd = res.data;
    }
    await this.spinner.hide();


    const modalQD = this.modal.create({
      nzTitle: 'Danh sách đề xuất kế hoạch lựa chọn nhà thầu',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsDxTaoQd,
        dataHeader: ['Số tờ trình đề xuất', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soDxuat', 'tenLoaiVthh', 'tenCloaiVthh']
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
        console.log(this.danhsachDx)
        this.formData.patchValue({
          cloaiVthh: data.hdr.cloaiVthh,
          tenCloaiVthh: data.hdr.tenCloaiVthh,
          loaiVthh: data.hdr.loaiVthh,
          tenLoaiVthh: data.hdr.tenLoaiVthh,
          tchuanCluong: data.hdr.tchuanCluong,
          loaiHdong: data.hdr.loaiHdong,
          pthucLcnt: data.hdr.pthucLcnt,
          hthucLcnt: data.hdr.hthucLcnt,
          nguonVon: data.hdr.nguonVon,
          soQdCc: data.hdr.soQd,
          trichYeu: data.hdr.trichYeu,
          tgianBdauTchuc: data.hdr.tgianBdauTchuc,
          tgianMthau: data.hdr.tgianMthau,
          tgianDthau: data.hdr.tgianDthau,
          tgianThien: data.hdr.tgianThien,
          gtriDthau: data.hdr.gtriDthau,
          gtriHdong: data.hdr.gtriHdong,
          vat: 5,
          tenDvi: data.hdr.tenDvi,
          maDvi: data.hdr.maDvi,
          dienGiai: data.hdr.dienGiai,
          idThHdr: null,
          soDx: data.hdr.soDxuat,
          // idTrHdr: dataRes.id,
          tongMucDt: tongMucDt
        })
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;

    }
    await this.spinner.hide();
  }

  index = 0;
  async showDetail($event, index) {
    debugger
    await this.spinner.show();
    if ($event.type == 'click') {
      this.selected = false
      $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
      $event.target.parentElement.classList.add('selectedRow');
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      console.log(this.danhsachDx)
      console.log(this.danhsachDxCache)
      this.dataInput = this.danhsachDx[index];
      this.dataInputCache = this.danhsachDxCache[index];
      this.index = index;
      await this.spinner.hide();
    } else {
      this.selected = true
      this.isTongHop = this.formData.value.phanLoai == 'TH';
      this.dataInput = this.danhsachDx[0];
      this.dataInputCache = this.danhsachDxCache[0];
      console.log(this.dataInput)
      console.log(this.dataInputCache)
      this.index = 0;
      await this.spinner.hide();
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
    console.log($event)
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
    debugger
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

}
