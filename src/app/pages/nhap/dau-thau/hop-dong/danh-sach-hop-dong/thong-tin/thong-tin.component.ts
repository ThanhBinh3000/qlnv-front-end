import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import {UploadComponent} from 'src/app/components/dialog/dialog-upload/upload.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  dauThauGoiThauService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import {ThongTinHopDongService} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {DonviLienQuanService} from 'src/app/services/donviLienquan.service';
import {
  QuyetDinhPheDuyetKetQuaLCNTService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import {STATUS} from "../../../../../../constants/status";
import {HelperService} from "../../../../../../services/helper.service";
import {ThongTinPhuLucHopDongService} from "../../../../../../services/thongTinPhuLucHopDong.service";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {
  ThongTinDauThauService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service';
import {DonviService} from "../../../../../../services/donvi.service";
import {
  DialogPhanBoHdVtComponent
} from "../../../../../../components/dialog/dialog-phan-bo-hd-vt/dialog-phan-bo-hd-vt.component";
import {addDays, differenceInCalendarDays} from 'date-fns'
import {PREVIEW} from "../../../../../../constants/fileType";
import printJS from "print-js";
import {CurrencyMaskInputMode} from "ngx-currency";
import {DanhSachGoiThau} from "../../../../../../models/DeXuatKeHoachuaChonNhaThau";
import { cloneDeep } from 'lodash';
interface DonviLienQuanModel {
    id: number;
    tenDvi: string;
    diaChi: string;
    mst: string;
    sdt: string;
    stk: string;
    nguoiDdien: string;
    chucVu: string;
    version?: number;
}

@Component({
    selector: 'app-thong-tin',
    templateUrl: './thong-tin.component.html',
    styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent implements OnInit, OnChanges {
    @Input() id: number;
    @Input() isView: boolean = false;
    @Input() isQuanLy: boolean = false;
    @Input() loaiVthh: String;
    @Input() idGoiThau: number;
    @Input() dataBinding: any;
    @Input() idKqLcnt: number;
    @Output()
    showListEvent = new EventEmitter<any>();
    maVthh: string;
    userInfo: UserLogin;

    detail: any = {};
    fileDinhKem: Array<FileDinhKem> = [];

    optionsDonVi: any[] = [];
    optionsDonViShow: any[] = [];

    listLoaiHopDong: any[] = [];
    listGoiThau: any[] = [];
    listNguoiDaiDien: any[] = [];
    dataTable: any[] = [];
    listDviLquan: any[] = [];
    isViewPhuLuc: boolean = false;
    idPhuLuc: number = 0;

    isVatTu: boolean = false;
    STATUS = STATUS;
    formData: FormGroup;
    maHopDongSuffix: string = '';
    listKqLcnt: any[] = [];
    titleStatus: string = '';
    donGiaCore: number = 0;
    listNam: any[] = [];
    isContentVisible: any[] = [true, true, true, true, true, true];
    isArrowUp: any[] = [false, false, false, false, false, false];
    listFileDinhKem: any[] = [];
    listCcPhapLy: any[] = [];
    dataPl: any[] = [];
    onlyViewPhuLuc: boolean = false;
    isDieuChinh: boolean = false;
    dataGthau: any = {};
    namKhoach: number = 0;
  showDlgPreview = false;
  pdfSrc: any;
  printSrc: any;
  wordSrc: any;
  reportTemplate: any = {
    typeFile: "",
    fileName: "",
    tenBaoCao: "",
    trangThai: ""
  };
  previewName : string;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  rowItem: any[] = [];
  rowItemEdit: any[] = [];
  listDiemKho: any[] = [];
  listType = ["MLK", "DV"]
    constructor(
        private router: Router,
        private fb: FormBuilder,
        public userService: UserService,
        public globals: Globals,
        private modal: NzModalService,
        private hopDongService: ThongTinHopDongService,
        private notification: NzNotificationService,
        private danhMucService: DanhMucService,
        private spinner: NgxSpinnerService,
        private dauThauGoiThauService: dauThauGoiThauService,
        private uploadFileService: UploadFileService,
        private donviLienQuanService: DonviLienQuanService,
        private ketQuaLcntService: QuyetDinhPheDuyetKetQuaLCNTService,
        private thongTinPhuLucHopDongService: ThongTinPhuLucHopDongService,
        private helperService: HelperService,
        private _modalService: NzModalService,
        private thongTinDauThauService: ThongTinDauThauService,
        private donViService: DonviService,
    ) {
        this.formData = this.fb.group(
            {
                id: [null],
                maHdong: [null, [Validators.required]],
                soQdKqLcnt: [null, [Validators.required]],
                idQdKqLcnt: [null, [Validators.required]],
                ngayQdKqLcnt: [null],
                soQdPdKhlcnt: [null],
                idGoiThau: [null, [Validators.required]],
                tenGoiThau: [null, [Validators.required]],
                tenHd: [null, [Validators.required]],
                ngayKy: [null],
                ghiChuNgayKy: [null],
                namHd: [dayjs().get('year')],
                ngayHieuLuc: [null],
                soNgayThien: [null],
                tgianNkho: [null],
                tenLoaiVthh: [null],
                moTaHangHoa: [null],
                loaiVthh: [null],
                cloaiVthh: [null],
                tenCloaiVthh: [null],
                soLuong: [null],
                dviTinh: [null],
                donGiaVat: [null],
                gtriHdSauVat: [null],
                tgianBhanh: [null],
                maDvi: [null, [Validators.required]],
                tenDvi: [null, [Validators.required]],
                diaChi: [null, [Validators.required]],
                mst: [null, [Validators.required]],
                sdt: [null, [Validators.required]],
                stk: [null, [Validators.required]],
                fax: [null],
                moTai: [null, [Validators.required]],
                giayUyQuyen: [null],
                tenNguoiDdien: [null, [Validators.required]],
                chucVu: [null, [Validators.required]],
                idNthau: [null],
                ghiChu: [null],
                canCuId: [null],
                loaiHdong: [null],
                ghiChuLoaiHdong: [],
                tenNhaThau: [],
                diaChiNhaThau: [],
                mstNhaThau: [],
                tenNguoiDdienNhaThau: [],
                chucVuNhaThau: [],
                sdtNhaThau: [],
                stkNhaThau: [null, [Validators.required]],
                faxNhaThau: [null],
                moTaiNhaThau: [null, [Validators.required]],
                giayUyQuyenNhaThau: [],
                donGia: [],
                trangThai: [STATUS.DU_THAO],
                tenTrangThai: ['Dự thảo'],
                noiDung: [],
                dieuKien: [],
                loaiHinhNx: 'Mua đấu thầu',
                kieuNx: 'Nhập mua',
              tgianGiaoDuHang: [],
              soNgayThienHd: [],
              ngayThienHd: [],
              ngayHlucHd: [],
              donViTinh: [],
              idNguoiDdien: [],
              tgianBdauTinhPhat: [],
              tgianGiaoThucTe: [],
              soTienTinhPhat: [],
              tgianBdamThienHd: [],
              slGiaoCham: [],
              namKhoach: [],
            }
        );
        this.formData.controls['donGiaVat'].valueChanges.subscribe(value => {
            if (value) {
                this.donGiaCore = value;
                const gtriHdSauVat = this.formData.controls.donGiaVat.value * this.formData.controls.soLuong.value;
                this.formData.controls['gtriHdSauVat'].setValue(gtriHdSauVat);
            } else {
                this.donGiaCore = 0;
                this.formData.controls['gtriHdSauVat'].setValue(0);
            }
        });
    }

    async ngOnInit() {
        await this.spinner.show();
        let dayNow = dayjs().get('year');
        this.userInfo = this.userService.getUserLogin();
        for (let i = -3; i < 23; i++) {
            this.listNam.push({
                value: dayNow - i,
                text: dayNow - i,
            });
        }
        if (!this.loaiVthh.startsWith('02')) {
          this.formData.patchValue({
            donViTinh: 'tấn',
          })
        }
        await Promise.all([
            this.loadDataComboBox(),
            this.onChangeNam(),
        ]);
        if (this.id) {
            // Đã có onchange
            // await this.loadChiTiet(this.id);
        } else {
            await this.initForm();
        }
        await this.spinner.hide();
    }

    async loadDataComboBox() {
      this.listLoaiHopDong = [];
      let resHd = await this.danhMucService.danhMucChungGetAll('HINH_THUC_HOP_DONG');
      if (resHd.msg == MESSAGE.SUCCESS) {
        this.listLoaiHopDong = resHd.data;
      }
    }

  async loadListNguoiDaiDien() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      }
    }
    await this.userService.search(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listNguoiDaiDien = res.data?.content
      }
    })
  }

    async initForm() {
        this.userInfo = this.userService.getUserLogin();
        this.formData.patchValue({
            maDvi: this.userInfo.MA_DVI ?? null,
            tenDvi: this.userInfo.TEN_DVI ?? null,
        })
        let res = await this.donViService.getDonVi({ str: this.formData.get("maDvi").value })
        this.formData.patchValue({
            diaChi: res.data.diaChi,
            sdt: res.data.sdt,
            fax: res.data.fax,
            mst: res.data.mst
        })
        if (this.dataBinding) {
            await this.bindingDataKqLcnt(this.dataBinding.id);
        }
    }

    async onChangeNam() {
        let namKh = this.formData.get('namHd').value;
        this.maHopDongSuffix = `/${namKh}/HĐMB`;
    }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hopDongService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const detail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, detail);
          this.formData.patchValue({
            maHdong: detail.soHd?.split('/')[0]
          });
          if (!this.loaiVthh.startsWith('02')) {
            this.formData.patchValue({
              donViTinh: 'tấn',
            })
          }
          this.idGoiThau = detail.idGoiThau;
          this.listFileDinhKem = detail.listFileDinhKem;
          this.listCcPhapLy = detail.listCcPhapLy;
          this.dataTable = detail.details;
          for (let i = 0; i < this.dataTable[0].children.length; i++) {
            let body = {
              maDvi: this.dataTable[0].children[i].maDvi,
              type: this.listType
            }
            const res = await this.donViService.layTatCaByMaDvi(body);
            if (res.msg == MESSAGE.SUCCESS) {
              const listDiemKho = [];
              for (let j = 0; j < res.data[0].children.length; j++) {
                const item = {
                  'maDvi': res.data[0].children[j].maDvi,
                  'tenDvi': res.data[0].children[j].tenDvi,
                  'diaDiemNhap': res.data[0].children[j].diaChi,
                };
                listDiemKho.push(item);
              }
              this.listDiemKho[i] = [...listDiemKho];
              this.rowItem.push(new DanhSachGoiThau())
            }
          }
          this.dataPl = detail.hhPhuLucHdongList;
          this.onChangeHluc();
          if (this.dataBinding) {
            await this.bindingDataKqLcnt(this.dataBinding.id);
          }
        }
      }
    }
  }

    async loaiHopDongGetAll() {
        this.listLoaiHopDong = [];
        let res = await this.danhMucService.loaiHopDongGetAll();
        if (res.msg == MESSAGE.SUCCESS) {
            this.listLoaiHopDong = res.data;
        }
    }

    async save(isKy?) {
        this.spinner.show();
        this.setValidator(isKy);
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
            this.spinner.hide();
            return;
        }
        let body = this.formData.value;
        if (this.formData.value.maHdong) {
            body.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
        }
        body.listFileDinhKem = this.listFileDinhKem;
        body.listCcPhapLy = this.listCcPhapLy;
        body.detail = this.dataTable;
        let res = null;
        if (this.formData.get('id').value) {
            res = await this.hopDongService.update(body);
        } else {
            res = await this.hopDongService.create(body);
        }
        if (res.msg == MESSAGE.SUCCESS) {
          this.id = res.data.id;
          this.formData.get('id').setValue(res.data.id);
            if (isKy) {
                await this.guiDuyet();
            } else {
                if (this.formData.get('id').value) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                }
            }
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
    }

    setValidator(isKy) {
        if (isKy) {
            this.formData.controls["maHdong"].setValidators([Validators.required]);
            this.formData.controls["tenHd"].setValidators([Validators.required]);
            if (this.loaiVthh.startsWith("02")) {
              this.formData.controls["noiDung"].setValidators([Validators.required]);
              this.formData.controls["dieuKien"].setValidators([Validators.required]);
              this.formData.controls["soNgayThien"].setValidators([Validators.required]);
            }
            this.formData.controls["idQdKqLcnt"].setValidators([Validators.required]);
            this.formData.controls["tenGoiThau"].setValidators([Validators.required]);
            this.formData.controls["tenHd"].setValidators([Validators.required]);
            this.formData.controls["maDvi"].setValidators([Validators.required]);
            this.formData.controls["tenDvi"].setValidators([Validators.required]);
            this.formData.controls["diaChi"].setValidators([Validators.required]);
            this.formData.controls["mst"].setValidators([Validators.required]);
            this.formData.controls["sdt"].setValidators([Validators.required]);
            this.formData.controls["stk"].setValidators([Validators.required]);
            this.formData.controls["moTai"].setValidators([Validators.required]);
            this.formData.controls["tenNguoiDdien"].setValidators([Validators.required]);
            this.formData.controls["chucVu"].setValidators([Validators.required]);
            this.formData.controls["stkNhaThau"].setValidators([Validators.required]);
            this.formData.controls["moTaiNhaThau"].setValidators([Validators.required]);
        } else {
          Object.keys(this.formData.controls).forEach(key => {
            const control = this.formData.controls[key];
            control.clearValidators();
            control.updateValueAndValidity();
          });
          this.formData.updateValueAndValidity();
        }
    }


    redirectPhuLuc(isView, id?) {
        this.detail.hd = this.formData.value;
        if (this.formData.value.maHdong) {
            this.detail.hd.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
        }
        this.detail.diaDiem = this.dataTable;
        this.isViewPhuLuc = true;
        this.onlyViewPhuLuc = isView;
        this.idPhuLuc = id;
    }

    showChiTiet() {
        this.isViewPhuLuc = false;
        this.loadChiTiet(this.id);
    }

    openDialogBang(data) {
        const modalPhuLuc = this.modal.create({
            nzTitle: 'Thông tin phụ lục bảng giá chi tiết hợp đồng',
            nzContent: DialogThongTinPhuLucBangGiaHopDongComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '1200px',
            nzFooter: null,
            nzComponentParams: {
                data: data
            },
        });
        modalPhuLuc.afterClose.subscribe((res) => {
            if (res) {
            }
        });
    }

    async openDialogKQLCNT() {
        await this.spinner.show();
        let body = {
            trangThai: STATUS.BAN_HANH,
            maDvi: this.userInfo.MA_DVI,
            paggingReq: {
                "limit": this.globals.prop.MAX_INTERGER,
                "page": 0
            },
            loaiVthh: this.loaiVthh,
            hdChuaBanHanh: true
        }
        let res = await this.ketQuaLcntService.search(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.listKqLcnt = res.data.content.filter(item => item.trangThaiHd != STATUS.HOAN_THANH_CAP_NHAT);
        } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
        }
        await this.spinner.hide();


        const modalQD = this.modal.create({
            nzTitle: 'Danh sách kết quả lựa chọn nhà thầu',
            nzContent: DialogTableSelectionComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                dataTable: this.listKqLcnt,
                dataHeader: ['Số QĐ kết quả LCNT', 'Số QĐ phê duyệt LCNT'],
                dataColumn: ['soQd', 'soQdPdKhlcnt'],
            },
        });
        modalQD.afterClose.subscribe(async (data) => {
            if (data) {
                await this.bindingDataKqLcnt(data.id);
            }
        });
    }

    async bindingDataKqLcnt(idKqLcnt) {
        await this.spinner.show();
        let res = await this.ketQuaLcntService.getDetail(idKqLcnt);
        if (res.msg == MESSAGE.SUCCESS) {
            const data = res.data;
            if (this.loaiVthh.startsWith('02')) {
                await this.bindingDataKqLcntVatTu(data, this.idGoiThau);
            } else {
                this.bindingDataKqLcntLuongThuc(data);
            }

        } else {
            this.notification.error(MESSAGE.ERROR, res.msg)
        }
        await this.spinner.hide();
    }

    async bindingDataKqLcntVatTu(data, idGthau?) {
      this.namKhoach = data.namKhoach;
      if (data.hhQdKhlcntHdr.dchinhDxKhLcntHdr) {
        this.listGoiThau = data.hhQdKhlcntHdr.dchinhDxKhLcntHdr.dsGthau.filter(item => item.trangThaiDt == STATUS.THANH_CONG && (data.listHopDong.map(e => e.idGoiThau).indexOf(item.id) < 0));
        this.isDieuChinh = true;
      } else {
        this.listGoiThau = data.hhQdKhlcntHdr.dsGthau.filter(item => item.trangThaiDt == STATUS.THANH_CONG && (data.listHopDong.map(e => e.idGoiThau).indexOf(item.id) < 0));
      }
      this.formData.patchValue({
        soQdKqLcnt: data.soQd,
        idQdKqLcnt: data.id,
        ngayQdKqLcnt: data.ngayKy,
        soQdPdKhlcnt: data.soQdPdKhlcnt,
        loaiHdong: data.hhQdKhlcntHdr?.loaiHdong,
        loaiVthh: data.hhQdKhlcntHdr?.loaiVthh,
        tenLoaiVthh: data.hhQdKhlcntHdr?.tenLoaiVthh,
        soNgayThien: data.hhQdKhlcntHdr?.tgianThien,
        soNgayThienHd: data.hhQdKhlcntHdr?.dxKhlcntHdr?.tgianThienHd,
        namKhoach: data.namKhoach,
      })
      this.onChangeHluc();
      if (this.id > 0 && idGthau > 0) {
        this.dataGthau = data.hhQdKhlcntHdr.dchinhDxKhLcntHdr ? data.hhQdKhlcntHdr.dchinhDxKhLcntHdr.dsGthau.find(item => item.id = idGthau) :
          data.hhQdKhlcntHdr.dsGthau.find(item => item.id = idGthau);
        this.dataGthau.children = this.dataTable
      }
    }

    bindingDataKqLcntLuongThuc(data) {
        const dataDtl = data.qdKhlcntDtl
        this.listGoiThau = dataDtl.children.filter(item => item.trangThaiDt == STATUS.THANH_CONG && (data.listHopDong.map(e => e.idGoiThau).indexOf(item.id) < 0));
        this.formData.patchValue({
            soQdKqLcnt: data.soQd,
            idQdKqLcnt: data.id,
            ngayQdKqLcnt: data.ngayTao,
            soQdPdKhlcnt: data.soQdPdKhlcnt,
            loaiHdong: dataDtl.dxuatKhLcntHdr?.loaiHdong,
            cloaiVthh: dataDtl.hhQdKhlcntHdr?.cloaiVthh,
            tenLoaiVthh: dataDtl.hhQdKhlcntHdr?.tenLoaiVthh,
            loaiVthh: dataDtl.hhQdKhlcntHdr?.loaiVthh,
            tenCloaiVthh: dataDtl.hhQdKhlcntHdr?.tenCloaiVthh,
            moTaHangHoa: dataDtl.dxuatKhLcntHdr?.moTaHangHoa,
            tgianNkho: dataDtl.dxuatKhLcntHdr?.tgianNhang,
          soNgayThien: dataDtl.dxuatKhLcntHdr?.tgianThien,
          // soNgayThienHd: dataDtl.dxuatKhLcntHdr?.tgianThienHd,
          namKhoach: data.namKhoach,
        })
      this.onChangeHluc();
    }

    openDialogGoiThau() {
        let modalQD;
        if (this.loaiVthh.startsWith('02')) {
            modalQD = this.modal.create({
                nzTitle: 'Danh sách các gói thầu trúng thầu',
                nzContent: DialogTableSelectionComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzWidth: '900px',
                nzFooter: null,
                nzComponentParams: {
                    dataTable: this.listGoiThau,
                    dataHeader: ['Tên gói thầu', 'Loại hàng DTQG', 'Số lượng', 'Đơn giá Vat'],
                    dataColumn: ['goiThau', 'tenLoaiVthh', 'soLuong', 'donGiaNhaThau'],
                },
            });
        } else {
            modalQD = this.modal.create({
                nzTitle: 'Danh sách các gói thầu trúng thầu',
                nzContent: DialogTableSelectionComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzWidth: '900px',
                nzFooter: null,
                nzComponentParams: {
                    dataTable: this.listGoiThau,
                    dataHeader: ['Tên gói thầu', 'Chủng loại hàng DTQG', 'Số lượng', 'Đơn giá Vat'],
                    dataColumn: ['goiThau', 'tenCloaiVthh', 'soLuong', 'donGiaNhaThau'],
                },
            });
        }
        modalQD.afterClose.subscribe(async (data) => {
            this.dataTable = [];
            if (data) {
                this.spinner.show();
              if (this.loaiVthh.startsWith('02')) {
                await this.onChangeGthauVt(data)
              } else {
                let res = await this.thongTinDauThauService.getDetailThongTin(data.id, this.loaiVthh);
                if (res.msg == MESSAGE.SUCCESS) {
                  let nhaThauTrung = res.data.dsNhaThauDthau.find(item => item.id == data.idNhaThau);
                  if (this.userService.isTongCuc()) {
                    this.dataTable = data.children;
                    this.dataTable.forEach(item => {
                      item.donGiaVat = data.donGiaNhaThau
                    })
                  } else {
                    for (let i = 0; i < data.children.length; i++) {
                      let body = {
                        maDvi: data.children[i].maDvi,
                        type: this.listType
                      }
                      const res = await this.donViService.layTatCaByMaDvi(body);
                      if (res.msg == MESSAGE.SUCCESS) {
                        const listDiemKho = [];
                        for (let j = 0; j < res.data[0].children.length; j++) {
                          const item = {
                            'maDvi': res.data[0].children[j].maDvi,
                            'tenDvi': res.data[0].children[j].tenDvi,
                            'diaDiemNhap': res.data[0].children[j].diaChi,
                          };
                          listDiemKho.push(item);
                        }
                        this.listDiemKho[i] = [...listDiemKho];
                        this.rowItem.push(new DanhSachGoiThau())
                      }
                    }
                    this.dataTable.push(data);
                  }
                  this.formData.patchValue({
                    idGoiThau: data.id,
                    tenGoiThau: data.goiThau,
                    tenNhaThau: nhaThauTrung?.tenNhaThau,
                    diaChiNhaThau: nhaThauTrung?.diaChi,
                    mstNhaThau: nhaThauTrung?.mst,
                    sdtNhaThau: nhaThauTrung?.sdt,
                    soLuong: data.soLuong,
                    donGia: data.donGiaNhaThau
                  })
                }
              }
              this.spinner.hide();
            }
        });
    }

    async onChangeGthauVt(data) {
      this.dataGthau = data;
      this.dataTable = data.children;
      this.dataTable.forEach(item => {
        item.donGiaVat = data.donGiaNhaThau
      })
      let type = "GOC";
      if (this.isDieuChinh) {
        type = "DC"
      }
      let res = await this.thongTinDauThauService.getDetailThongTinVt(data.id, this.loaiVthh, type);
      if (res.msg == MESSAGE.SUCCESS) {
        let nhaThauTrung = res.data.dsNhaThauDthau.find(item => item.id == data.idNhaThau);
        this.formData.patchValue({
          idGoiThau: data.id,
          tenGoiThau: data.goiThau,
          tenNhaThau: data.tenNhaThau,
          diaChiNhaThau: nhaThauTrung?.diaChi,
          mstNhaThau: nhaThauTrung?.mst,
          sdtNhaThau: nhaThauTrung?.sdt,
          soLuong: data.soLuong,
          donGia: data.donGiaNhaThau,
          donViTinh: data.dviTinh,
          tenCloaiVthh: data.tenCloaiVthh,
          cloaiVthh: data.cloaiVthh,
        })
      }
    }

    convertTienTobangChu(tien: number): string {
        return convertTienTobangChu(tien);
    }

    back() {
        this.showListEvent.emit();
    }

    taiLieuDinhKem(type?: string) {
        const modal = this.modal.create({
            nzTitle: 'Tài liệu đính kèm',
            nzContent: UploadComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modal.afterClose.subscribe((res) => {
            if (res) {
                this.uploadFileService
                    .uploadFile(res.file, res.tenTaiLieu)
                    .then((resUpload) => {
                        const fileDinhKem = new FileDinhKem();
                        fileDinhKem.fileName = resUpload.filename;
                        fileDinhKem.fileSize = resUpload.size;
                        fileDinhKem.fileUrl = resUpload.url;
                        this.fileDinhKem.push(fileDinhKem);
                    });
            }
        });
    }

    downloadFile(taiLieu: any) {
        this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
            saveAs(blob, taiLieu.fileName);
        });
    }

    deleteTaiLieu(index: number) {
        this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
    }

    guiDuyet() {
        this._modalService.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: `Bạn có chắc chắn muốn ký hợp đồng này không?`,
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 365,
            nzOnOk: async () => {
                const body = {
                    id: this.id,
                    trangThai: STATUS.DA_KY,
                }
                let res = await this.hopDongService.approve(
                    body,
                );
                if (res.msg == MESSAGE.SUCCESS) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
                    this.back();
                } else {
                    this.notification.error(MESSAGE.ERROR, res.msg);
                }
            },
        });
    }

    xoaPhuLuc(id: any) {
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
                    this.thongTinPhuLucHopDongService.delete({ id: id })
                        .then(async () => {
                            await this.loadChiTiet(this.id);
                        });
                } catch (e) {
                    console.log('error: ', e);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
                this.spinner.hide();
            },
        });
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            await this.spinner.show();
            this.userInfo = this.userService.getUserLogin();
            await this.loadListNguoiDaiDien();
            await this.loadChiTiet(this.id);
            await this.spinner.hide()
        }
    }

    isDisableForm(): boolean {
        if (this.formData.value.trangThai == STATUS.DA_KY || this.isView) {
            return true;
        } else {
            return false
        }
    }

    getNameFile($event) {

    }

    expandSet = new Set<number>();
    onExpandChange(id: number, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id);
        } else {
            this.expandSet.delete(id);
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

    calcTongSl() {
        if (this.dataTable) {
            let sum = 0
            this.dataTable.forEach(item => {
                sum += item.soLuong;
            })
            return sum;
        }
    }

    calcTongThanhTien() {
        if (this.dataTable) {
            let sum = 0
            this.dataTable.forEach(item => {
                sum += item.soLuong * item.donGiaNhaThau;
            })
            return sum;
        }
    }

    toggleContentVisibility(i) {
        this.isContentVisible[i] = !this.isContentVisible[i];
        this.isArrowUp[i] = !this.isArrowUp[i];
    }

  themMoiChiCuc() {
    const modal = this.modal.create({
      nzTitle: "THÔNG TIN GÓI THẦU",
      nzContent: DialogPhanBoHdVtComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1500px",
      nzFooter: null,
      nzClassName: "dialog-vat-tu",
      nzComponentParams: {
        data: this.dataGthau,
        loaiVthh: this.formData.get("loaiVthh").value,
        dviTinh: this.formData.get("loaiVthh").value.maDviTinh,
        namKeHoach: this.namKhoach
      }
    })
    modal.afterClose.subscribe(async (res) => {
      if (res) {
        this.dataGthau.children = res;
        for (let i = 0; i < this.dataTable.length; i++) {
          res.forEach(item => {
            if(item.maDvi == this.dataTable[i].maDvi) {
              this.dataTable[i].children = item.children
            }
          })
        }
      }
    })
  }

  onChangeNguoiDaiDien(event) {
      if (event) {
        let ngDaiDien =  this.listNguoiDaiDien.find(i => i.id == event)
        this.formData.patchValue({
          tenNguoiDdien: ngDaiDien?.fullName,
          chucVu: ngDaiDien?.positionName,
          sdt: ngDaiDien?.phoneNo,
        })
      }
  }

  onChangeHluc() {
    if (this.formData.get('ngayHlucHd').value != null) {
      let ngayKy = dayjs(this.formData.get('ngayHlucHd').value).toDate();
      if(this.formData.get('soNgayThienHd').value != null) {
        let ngayThienHd = addDays(ngayKy, this.formData.get('soNgayThienHd').value)
        this.formData.patchValue({
          ngayThienHd: ngayThienHd,
        })
      }
      if(this.formData.get('soNgayThien').value != null) {
        let tgianGiaoDuHang = addDays(ngayKy, this.formData.get('soNgayThien').value)
        this.formData.patchValue({
          tgianGiaoDuHang: tgianGiaoDuHang,
        })
        if(this.formData.get('tgianGiaoThucTe').value != null) {
          let tgianGiaoThucTe = dayjs(this.formData.get('tgianGiaoThucTe').value).toDate();
          let tgianBdauTinhPhat = differenceInCalendarDays(tgianGiaoThucTe, tgianGiaoDuHang)
          this.formData.patchValue({
            tgianBdauTinhPhat: tgianBdauTinhPhat,
          })
        }
      }
    }
  }

  onChangeTgianGiaoThucTe() {
      if(this.loaiVthh.startsWith('02')) {
        if(this.formData.get('tgianGiaoThucTe').value != null && this.formData.get('tgianGiaoDuHang').value != null) {
          let tgianGiaoThucTe = dayjs(this.formData.get('tgianGiaoThucTe').value).toDate();
          let tgianGiaoDuHang = dayjs(this.formData.get('tgianGiaoDuHang').value).toDate();
          let tgianBdauTinhPhat = differenceInCalendarDays(tgianGiaoThucTe, tgianGiaoDuHang)
          this.formData.patchValue({
            tgianBdauTinhPhat: tgianBdauTinhPhat,
          })
        }
      } else {
        if(this.formData.get('tgianGiaoThucTe').value != null && this.formData.get('tgianNkho').value != null) {
          let tgianGiaoThucTe = dayjs(this.formData.get('tgianGiaoThucTe').value).toDate();
          let tgianNkho = dayjs(this.formData.get('tgianNkho').value).toDate();
          let tgianBdauTinhPhat = differenceInCalendarDays(tgianGiaoThucTe, tgianNkho)
          this.formData.patchValue({
            tgianBdauTinhPhat: tgianBdauTinhPhat,
          })
        }
      }
  }

  onchangeTgThienHd() {
    if (this.formData.get('ngayHlucHd').value != null) {
      let ngayKy = dayjs(this.formData.get('ngayHlucHd').value).toDate();
      if (this.formData.get('soNgayThienHd').value != null) {
        let ngayThienHd = addDays(ngayKy, this.formData.get('soNgayThienHd').value)
        this.formData.patchValue({
          ngayThienHd: ngayThienHd,
        })
      }
    }
  }
  async preview() {
      if (this.loaiVthh.startsWith('02')) {
        this.previewName = 'thong_tin_hop_dong_vt'
      } else {
        this.previewName = 'thong_tin_hop_dong_lt'
      }
    let body = this.formData.value;
    this.reportTemplate.fileName = this.previewName + '.docx';
    body.reportTemplateRequest = this.reportTemplate;
    await this.hopDongService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.printSrc = s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }
  downloadPdf(fileName: string) {
    saveAs(this.pdfSrc, fileName + '.pdf');
  }

  downloadWord(fileName: string) {
    saveAs(this.wordSrc, fileName + '.docx');
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }

  themDiaDiemNhap(y) {
    if (this.rowItem[y].soLuong <= 0) {
      this.notification.error(MESSAGE.ERROR, "Số lượng phân bổ không được để trống.")
      return false;
    }
    let soLuong = 0;
    this.dataTable[0].children[y].children.forEach(item => {
      soLuong += item.soLuong
    })
    if (soLuong + this.rowItem[y].soLuong > this.dataTable[0].children[y].soLuong ) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu.")
      return false;
    }
    let diemKho = this.listDiemKho[y].find(x => x.maDvi == this.rowItem[y].maDvi);
    this.rowItem[y].maDvi = diemKho.maDvi;
    this.rowItem[y].tenDvi = diemKho.tenDvi;
    this.rowItem[y].diaDiemNhap = diemKho.diaDiemNhap;
    this.dataTable[0].children[y].children = [...this.dataTable[0].children[y].children, this.rowItem[y]]
    this.rowItem[y] = new DanhSachGoiThau();
  }

  clearDiaDiemNhap(y) {
    this.rowItem[y] = new DanhSachGoiThau();
  }

  editRow(y, z) {
    this.dataTable[0].children[y].children.forEach(i => {
      i.edit = false;
    })
    this.dataTable[0].children[y].children[z].edit = true
    this.rowItemEdit[z] = cloneDeep(this.dataTable[0].children[y].children[z])
  }

  xoaDiaDiemNhap(y, z) {
    this.dataTable[0].children[y].children.splice(z, 1);
  }

  saveEdit(y, z) {
    let soLuong = 0;
    let data = cloneDeep(this.dataTable[0].children[y].children);
    data.splice(z, 1)
    data.forEach(i => {
      soLuong += i.soLuong;
    })
    if (soLuong + this.rowItemEdit[z].soLuong  > this.dataTable[0].children[y].soLuong) {
      this.notification.error(MESSAGE.ERROR, "Số lượng đã vượt quá chỉ tiêu.")
      return false;
    }
    let diemKho = this.listDiemKho[y].find(x => x.maDvi == this.rowItemEdit[z].maDvi);
    this.rowItemEdit[z].maDvi = diemKho.maDvi;
    this.rowItemEdit[z].tenDvi = diemKho.tenDvi;
    this.rowItemEdit[z].diaDiemNhap = diemKho.diaDiemNhap;
    this.dataTable[0].children[y].children[z] = cloneDeep(this.rowItemEdit[z])
    this.dataTable[0].children[y].children[z].edit = false
    this.rowItemEdit[z] = new DanhSachGoiThau();
  }
  cancelEdit(y, z) {
    this.dataTable[0].children[y].children[z].edit = false
    this.rowItemEdit[z] = new DanhSachGoiThau();
  }
}
