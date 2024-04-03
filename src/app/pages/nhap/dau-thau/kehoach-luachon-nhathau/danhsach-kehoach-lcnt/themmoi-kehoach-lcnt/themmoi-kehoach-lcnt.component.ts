import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {saveAs} from 'file-saver';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  DialogThemMoiVatTuComponent
} from 'src/app/components/dialog/dialog-them-moi-vat-tu/dialog-them-moi-vat-tu.component';
import {MESSAGE} from 'src/app/constants/message';
import {CanCuXacDinh, DanhSachGoiThau, FileDinhKem,} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  DanhSachDauThauService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import * as dayjs from 'dayjs';
import {API_STATUS_CODE, LOAI_HANG_DTQG} from 'src/app/constants/config';
import {VatTu} from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {STATUS} from "../../../../../../constants/status";
import {DatePipe} from "@angular/common";
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {PREVIEW} from "../../../../../../constants/fileType";
import {convertTienTobangChu} from "../../../../../../shared/commonFunction";
import {CurrencyMaskInputMode} from "ngx-currency";
import {SoLuongNhapHangService} from "../../../../../../services/qlnv-hang/nhap-hang/sl-nhap-hang.service";


@Component({
  selector: 'app-themmoi-kehoach-lcnt',
  templateUrl: './themmoi-kehoach-lcnt.component.html',
  styleUrls: ['./themmoi-kehoach-lcnt.component.scss'],
})
export class ThemmoiKehoachLcntComponent extends Base2Component implements OnInit, OnChanges {
  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Input()
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Input() soDx: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: DanhSachGoiThau } } = {};

  listOfData: any[] = [];
  fileDinhKem: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  i = 0;
  tabSelected: string = 'thongTinChung';
  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listNam: any[] = [];
  listThuHoachVu: any[] = [];
  listQuocGia: any[] = [];
  listVat: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  dataChiTieu: any;
  baoGiaThiTruongList: CanCuXacDinh[] = [];
  canCuKhacList: CanCuXacDinh[] = [];
  maTrinh: string = '';
  addModelBaoGia: any = {
    moTa: '',
    tenTlieu: '',
    taiLieu: [],
  };
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };
  taiLieuDinhKemList: any[] = [];
  listDataGroup: any[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  tongTienHopDong: any;
  showDlgPreview = false;
  pdfBlob: any;
  pdfSrc: any;
  wordSrc: any;
  ykienThamGia: string;
  ghiChu: string;
  reportTemplate: any = {
    typeFile: '',
    fileName: 'de-xuat-nhap-dau-thau-luong-thuc.docx',
    tenBaoCao: '',
    trangThai: '',
  };

  listDsGthau: any = [{
    tenDvi: '',
    soLuong: ''
  }];
  listQuy: any[] = [];
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauThauService: DanhSachDauThauService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private soLuongNhapHangService: SoLuongNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dauThauService);
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      diaChiDvi: [],
      namKhoach: [dayjs().get('year'), [Validators.required]],
      soDxuat: [null],
      trichYeu: [null],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      ngayPduyet: [],
      soQd: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [, [Validators.required]],
      moTaHangHoa: [, [Validators.required]],
      tchuanCluong: [null],
      tenDuAn: [null, [Validators.required]],
      loaiHdong: [null, [Validators.required]],
      hthucLcnt: [null, [Validators.required]],
      pthucLcnt: [null, [Validators.required]],
      tgianBdauTchuc: [null],

      tgianDthau: [null, [Validators.required]],
      tgianMthau: [null, [Validators.required]],

      gtriDthau: [null, [Validators.required]],
      gtriHdong: [null, [Validators.required]],
      donGiaVat: [],
      thueVat: [],
      tongMucDt: [null],
      tongMucDtLamTron: [null],
      tongMucDtDx: [null, [Validators.required]],
      tongMucDtDxLamTron: [null, [Validators.required]],
      nguonVon: ['NV_NSNN', [Validators.required]],
      dienGiai: [''],
      tgianNhang: [null, [Validators.required]],
      tgianThien: [null, [Validators.required]],
      ghiChu: [null],
      ldoTuchoi: [],
      trangThai: ['00'],
      tenTrangThai: ['Dự Thảo'],
      diaDiemDuAn: [''],
      ykienThamGia: [''],
      tongMucDtBangChu: [''],
      tongSlChiTieu: [''],
      quy: [""],
      ctietTccl: [''],
      namSxuat: [''],
      vu: [''],
      thuHoachVu: [''],
      namThuHoach: [''],
      quocGiaSx: [''],
      giaBanHoSo: [''],
      tgianMoHoSo: [null],
      soQdPdGiaCuThe: [''],
      ngayKyQdPdGiaCuThe: [''],
      tgianMthauTime: [null],
      tgianDthauTime: [null],
      tgianMoHoSoTime: [null],
      idChiTieuKhNam: [],
      maThueVat: [],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maTrinh = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData.get('loaiVthh').setValue(this.loaiVthhInput);
    this.loadDanhMucHang();
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    this.initListQuy();
    await this.spinner.hide();
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.spinner.show();
    if (changes) {
      try {
        if (this.idInput > 0) {
          await this.getDetail(this.idInput, null);
        } else {
          if (this.soDx) {
            await this.getDetail(null, this.soDx);
          }
          this.initForm();
        }
      } catch (e) {
        console.log("error: ", e);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
    await this.spinner.hide();
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
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'NHAP_DT');
      this.formData.get('loaiHinhNx').setValue(this.listLoaiHinhNx[0].ma)
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
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
    this.listThuHoachVu = [];
    let resVu = await this.danhMucService.danhMucChungGetAll('VU_THU_HOACH');
    if (resVu.msg == MESSAGE.SUCCESS) {
      this.listThuHoachVu = resVu.data;
    }
    this.listQuocGia = [];
    let resQg = await this.danhMucService.danhMucChungGetAll('QUOC_GIA');
    if (resQg.msg == MESSAGE.SUCCESS) {
      this.listQuocGia = resQg.data;
    }
    let resVat = await this.danhMucService.danhMucChungGetAll('THUE_SUAT_VAT');
    if (resVat.msg == MESSAGE.SUCCESS) {
      this.listVat = resVat.data;
    }
  }

  async loadDanhMucHang() {
    await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        const data = hangHoa.data.filter(item => item.ma == this.loaiVthhInput.slice(0, 2));
        if (this.loaiVthhInput == LOAI_HANG_DTQG.MUOI || this.loaiVthhInput == LOAI_HANG_DTQG.VAT_TU) {
          this.formData.get('tenLoaiVthh').setValue(data[0].ten);
        } else {
          const dataChild = data[0].child.filter(item => item.ma == this.loaiVthhInput)
          this.formData.get('tenLoaiVthh').setValue(dataChild[0].ten);
        }
      }
    })
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  async preview() {
    let pipe = new DatePipe('en-US');
    let body = this.formData.value;
    body.reportTemplateRequest = this.reportTemplate;
    body.listDsGthau = this.listDsGthau;
    body.fileDinhKemReq = this.fileDinhKem;
    body.tongMucDtBangChu = convertTienTobangChu(this.formData.get('tongMucDt').value)
    body.tgianDthau = pipe.transform(body.tgianDthau, 'yyyy-MM-dd HH:mm')
    body.tgianMthau = pipe.transform(body.tgianMthau, 'yyyy-MM-dd HH:mm')
    await this.dauThauService.preview(body).then(async s => {
      this.pdfSrc = PREVIEW.PATH_PDF + s.data.pdfSrc;
      this.wordSrc = PREVIEW.PATH_WORD + s.data.wordSrc;
      this.showDlgPreview = true;
    });
  }

  downloadPdf() {
    saveAs(this.pdfSrc, "De-xuat-ke-hoach-lua-chon-nha-thau.pdf");
  }

  downloadWord() {
    saveAs(this.wordSrc, "De-xuat-ke-hoach-lua-chon-nha-thau.docx");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async getDetail(id?: number, soDx?: string) {
    if (id) {
      await this.dauThauService
        .getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.ykienThamGia = this.formData.get("ykienThamGia").value;
            this.ghiChu = this.formData.get("ghiChu").value;
            this.formData.patchValue({
              tgianBdauTchuc: dataDetail.tgianBdauTchuc,
              soDxuat: dataDetail.soDxuat?.split('/')[0],
              tongMucDtLamTron: parseFloat((this.formData.get('tongMucDt').value / 1000000).toFixed(2)),
              tongMucDtDxLamTron: parseFloat((this.formData.get('tongMucDtDx').value / 1000000).toFixed(2)),
            })
            if (dataDetail.soDxuat != null) {
              this.maTrinh = '/' + dataDetail.soDxuat?.split('/')[1]
            }
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.bindingCanCu(dataDetail.ccXdgDtlList);
            }
            if (this.formData.get('trangThai').value != STATUS.DU_THAO) {
              this.getDataChiTieuById(dataDetail.idChiTieuKhNam)
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    if (soDx) {
      var body = this.formData.value
      body.soDxuat = soDx
      await this.dauThauService
        .getDetailBySoDx(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataDetail = res.data;
            this.helperService.bidingDataInFormGroup(this.formData, dataDetail);
            this.formData.patchValue({
              soDxuat: dataDetail.soDxuat?.split('/')[0]
            })
            if (dataDetail) {
              this.fileDinhKem = dataDetail.fileDinhKems;
              this.listOfData = dataDetail.dsGtDtlList;
              this.bindingCanCu(dataDetail.ccXdgDtlList);
            }
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    for (let item of this.listOfData) {
      for (let child of item.children) {
        let body = {
          year: this.formData.value.namKhoach,
          loaiVthh: this.formData.value.loaiVthh,
          maDvi: child.maDvi
        }
        let soLuongDaLenKh = await this.soLuongNhapHangService.getSoLuongCtkhTheoQd(body);
        if (soLuongDaLenKh != null) {
          child.soLuongDaMua = soLuongDaLenKh.data;
        }
      }
    }
  }

  isDetailPermission() {
    if (this.loaiVthhInput === "02") {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return true;
      }
    } else {
      if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return true;
      }
    }
    this.notification.error(MESSAGE.ERROR, "Bạn không có quyền truy cập chức năng này !")
    return false;
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChiDvi: this.userInfo.DON_VI.diaChi,
    })
  }

  bindingCanCu(data) {
    if (data && data.length > 0) {
      data.forEach((chiTiet) => {
        if (chiTiet.loaiCanCu == '00') {
          this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, chiTiet];
        } else if (chiTiet.loaiCanCu == '01') {
          this.canCuKhacList = [...this.canCuKhacList, chiTiet];
        }
      });
    }
  }

  selectHangHoa() {
    let data = this.loaiVthhInput;
    let bodyParamVatTu = {
      data,
      isCaseSpecial: true,
      onlyVatTu: true
    }
    let bodyParamLT = {
      data,
      onlyLuongThuc: true
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng DTQG',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: this.userService.isCuc() ? bodyParamLT : bodyParamVatTu
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.userService.isCuc()) {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            tenCloaiVthh: data.ten,
            loaiVthh: data.parent.ma,
            tenLoaiVthh: data.parent.ten,
          });
          let res = await this.dmTieuChuanService.getDetailByMaHh(
            this.formData.get('cloaiVthh').value,
          );
          if (res.statusCode == API_STATUS_CODE.SUCCESS) {
            this.formData.patchValue({
              tchuanCluong: res.data ? res.data.tenQchuan : null,
            });
          }
        } else {
          this.formData.patchValue({
            cloaiVthh: data.ma,
            loaiVthh: data.ma,
            tenLoaiVthh: data.ten
          });
        }
      }
    });
  }

  themMoiCuc(event, goiThau?: string) {
    event.stopPropagation();
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng DTQG');
      return;
    }
    let data = [];
    let listGoiThau = [];
    this.listOfData.forEach(item => {
      listGoiThau.push(item.goiThau)
      if (goiThau && goiThau != '' && item.goiThau == goiThau) {
        data.push(item)
      }
    })
    let setListGoiThau = new Set(listGoiThau);
    listGoiThau = [...setListGoiThau]
    let disabledGoiThau = false;
    if (goiThau && goiThau != '') {
      disabledGoiThau = true;
    }
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiVatTuComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1500px',
      nzFooter: null,
      nzClassName: 'dialog-luong-thuc',
      nzComponentParams: {
        disabledGoiThau: disabledGoiThau,
        dataAll: this.listOfData,
        listGoiThau: listGoiThau,
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        loaiVthh: this.formData.get('loaiVthh').value,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        namKhoach: this.formData.get('namKhoach').value
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      // this.formData.patchValue({
      //   thueVat: res.value.thueVat
      // })
      let isReplace = false;
      if (res.value.goiThau && res.value.goiThau != '') {
        for (let i = 0; i < this.listOfData.length; i++) {
          if (this.listOfData[i].goiThau == res.value.goiThau) {
            this.listOfData.splice(i, 1, res.value)
            isReplace = true;
          }
        }
      }
      if (isReplace == false) {
        this.listOfData = [...this.listOfData, res.value]
      }
      this.tinhTongMucDtDx()
    });

  }

  tinhTongMucDtDx() {
    let tongMucDt: number = 0;
    let tongMucDtDx: number = 0;
    let tongSlChiTieu: number = 0;
    this.listOfData.forEach((item) => {
      item.children.forEach(child => {
        tongMucDt = tongMucDt + (child.soLuong * child.donGia);
        tongMucDtDx = tongMucDtDx + (child.soLuong * child.donGiaTamTinh);
        tongSlChiTieu += child.soLuongChiTieu
      })
    });
    this.formData.patchValue({
      tongMucDtLamTron: parseFloat((tongMucDt / 1000000).toFixed(2)),
      tongMucDtDxLamTron: parseFloat((tongMucDtDx / 1000000).toFixed(2)),
      tongMucDt: tongMucDt,
      tongMucDtDx: tongMucDtDx,
      tongSlChiTieu: tongSlChiTieu,
    });
  }

  deleteGoiThau(i: number) {
    this.listOfData.splice(i, 1)
    this.tinhTongMucDtDx()
  }

  deleteDiemKho(i: number, y: number, z: number) {
    this.listOfData[i].children[y].children.splice(z, 1)
    if (this.listOfData[i].children[y].children.length > 0) {
      let soLuong = 0;
      this.listOfData[i].children[y].children.forEach(item => {
        soLuong += item.soLuong
      })
      this.listOfData[i].children[y].soLuong = soLuong;
    } else {
      this.listOfData[i].children.splice(y, 1)
    }
    if (this.listOfData[i].children.length > 0) {
      let soLuongGoiThau = 0;
      this.listOfData[i].children.forEach(chiCuc => {
        soLuongGoiThau += chiCuc.soLuong
      })
      this.listOfData[i].soLuong = soLuongGoiThau
    }
    this.tinhTongMucDtDx()
  }

  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator(isGuiDuyet);
    if (!isGuiDuyet && this.formData.get('trangThai').value == this.STATUS.DU_THAO) {
      this.clearValidatorLuuDuThao();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.formData.get('loaiVthh').value == null) {
        this.formData.get('loaiVthh').setValue(this.loaiVthhInput)
      }
      await this.luuVaGuiDuyet(isGuiDuyet);
    } else {
      this.khoiPhucValidator()
      this.setValidator(isGuiDuyet);
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        return;
      }
      if (this.listOfData.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          'Danh sách kế hoạch không được để trống',
        );
        return;
      }
      if (this.validateSave()) {
        await this.luuVaGuiDuyet(isGuiDuyet)
      }
    }
  }

  async luuVaGuiDuyet(isGuiDuyet) {
    let pipe = new DatePipe('en-US');
    if (this.formData.value.tgianMthau != null) {
      if (this.formData.value.tgianMthauTime != null) {
        this.formData.value.tgianMthau = pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianMthauTime, 'HH:mm') + ":00"
      } else {
        this.formData.value.tgianMthau = pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd') + " 00:00:00"
      }
    }
    if (this.formData.value.tgianDthau != null) {
      if (this.formData.value.tgianDthauTime != null) {
        this.formData.value.tgianDthau = pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianDthauTime, 'HH:mm') + ":00"
      } else {
        this.formData.value.tgianDthau = pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    if (this.formData.value.tgianMoHoSo != null) {
      if (this.formData.value.tgianMoHoSoTime != null) {
        this.formData.value.tgianMoHoSo = pipe.transform(this.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianMoHoSoTime, 'HH:mm') + ":00"
      } else {
        this.formData.value.tgianMoHoSo = pipe.transform(this.formData.value.tgianMoHoSo, 'yyyy-MM-dd') + " 23:59:59"
      }
    }
    let body = this.formData.value;
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
    body.tgianMthauTime = pipe.transform(body.tgianMthauTime, 'yyyy-MM-dd HH:mm')
    body.tgianDthauTime = pipe.transform(body.tgianDthauTime, 'yyyy-MM-dd HH:mm')
    body.tgianMoHoSoTime = pipe.transform(body.tgianMoHoSoTime, 'yyyy-MM-dd HH:mm')
    body.fileDinhKemReq = this.fileDinhKem;
    body.dsGtReq = this.listOfData;
    body.ccXdgReq = [...this.baoGiaThiTruongList, ...this.canCuKhacList];
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dauThauService.update(body);
    } else {
      res = await this.dauThauService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        await this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          // this.quayLai();
        } else {
          this.formData.get('id').setValue(res.data.id);
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          // this.quayLai();
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soDxuat"].clearValidators();
    }
    if (this.userService.isTongCuc()) {
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();
      // this.formData.controls["donGiaVat"].clearValidators();
      this.formData.controls["tgianNhang"].clearValidators();
      this.formData.controls["tgianThien"].setValidators([Validators.required]);
    } else {
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
      // this.formData.controls["donGiaVat"].setValidators([Validators.required]);
      this.formData.controls["tgianNhang"].setValidators([Validators.required]);
      this.formData.controls["tgianThien"].clearValidators();
    }
  }

  khoiPhucValidator() {
    this.formData.controls["tenDvi"].setValidators([Validators.required]);
    this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
    this.formData.controls["kieuNx"].setValidators([Validators.required]);
    this.formData.controls["namKhoach"].setValidators([Validators.required]);
    this.formData.controls["soQd"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
    this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
    this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    this.formData.controls["tenDuAn"].setValidators([Validators.required]);
    this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
    this.formData.controls["quy"].setValidators([Validators.required]);
    this.formData.controls["tgianDthau"].setValidators([Validators.required]);
    this.formData.controls["tgianMthau"].setValidators([Validators.required]);
    this.formData.controls["gtriDthau"].setValidators([Validators.required]);
    this.formData.controls["gtriHdong"].setValidators([Validators.required]);
    this.formData.controls["tongMucDtDx"].setValidators([Validators.required]);
    this.formData.controls["nguonVon"].setValidators([Validators.required]);
    this.formData.controls["tgianNhang"].setValidators([Validators.required]);
    this.formData.controls["tgianThien"].setValidators([Validators.required]);
  }

  clearValidatorLuuDuThao() {
    Object.keys(this.formData.controls).forEach(key => {
      const control = this.formData.controls[key];
      control.clearValidators();
      control.updateValueAndValidity();
    });
    this.formData.updateValueAndValidity();
  }

  validateSave() {
    let pipe = new DatePipe('en-US');
    let tgianMthau;
    let tgianDthau;
    if (this.formData.value.tgianMthau != null) {
      if (this.formData.value.tgianMthauTime != null) {
        tgianMthau = new Date(pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianMthauTime, 'HH:mm') + ":00")
      } else {
        tgianMthau = new Date(pipe.transform(this.formData.value.tgianMthau, 'yyyy-MM-dd') + " 00:00:00")
      }
    }
    if (this.formData.value.tgianDthau != null) {
      if (this.formData.value.tgianDthauTime != null) {
        tgianDthau = new Date(pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " " + pipe.transform(this.formData.value.tgianDthauTime, 'HH:mm') + ":00")
      } else {
        tgianDthau = new Date(pipe.transform(this.formData.value.tgianDthau, 'yyyy-MM-dd') + " 23:59:59")
      }
    }
    let tgianBdauTchuc = new Date(pipe.transform(this.formData.value.tgianBdauTchuc, 'yyyy-MM-dd') + " 23:59:59");
    let tgianNhang = new Date(pipe.transform(this.formData.value.tgianNhang, 'yyyy-MM-dd') + " 00:00:00");
    if (tgianBdauTchuc >= tgianMthau) {
      this.notification.error(MESSAGE.ERROR, "Thời gian bắt đầu tổ chức không được vượt quá thời gian mở thầu")
      return false
    }
    // else if (tgianMthau >= tgianDthau) {
    //   this.notification.error(MESSAGE.ERROR, "Thời gian mở thầu không được vượt quá thời gian đóng thầu")
    //   return false
    // }
    else if (tgianDthau >= tgianNhang) {
      this.notification.error(MESSAGE.ERROR, "Thời gian đóng thầu không được vượt quá thời gian nhập hàng")
      return false
    }
    return true;
  }

  async getDataChiTieu() {
    let res2 = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
      +this.formData.get('namKhoach').value,)
    if (res2.msg == MESSAGE.SUCCESS) {
      this.dataChiTieu = res2.data;
      this.formData.patchValue({
        soQd: this.dataChiTieu.soQuyetDinh,
        idChiTieuKhNam: this.dataChiTieu.id
      });
    } else {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQd: null
      });
    }
  }

  async getDataChiTieuById(id) {
    await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachNam(id).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataChiTieu = res.data;
        this.formData.patchValue({
          soQd: this.dataChiTieu.soQuyetDinh,
          idChiTieuKhNam: this.dataChiTieu.id
        });
      }
    }).catch((e) => {
      this.dataChiTieu = null;
      this.formData.patchValue({
        soQd: null,
        idChiTieuKhNam: null
      });
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
  }

  onChangeNamKh() {
    if (this.formData.get('trangThai').value == STATUS.TU_CHOI_LDV || this.formData.get('trangThai').value == STATUS.DU_THAO) {
      this.getDataChiTieu();
    }
    this.initListQuy()
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.userService.isTongCuc() ? await this.guiDuyetTongCuc() : await this.guiDuyetCuc()
  }

  async guiDuyetTongCuc() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.formData.get('id').value,
            trangThai: '',
          };
          if (this.formData.get('loaiVthh').value.startsWith('02')) {
            switch (this.formData.get('trangThai').value) {
              case STATUS.TU_CHOI_LDV:
              case STATUS.DU_THAO: {
                body.trangThai = STATUS.CHO_DUYET_LDV;
                break;
              }
              case STATUS.CHO_DUYET_LDV: {
                body.trangThai = STATUS.DA_DUYET_LDV;
                break;
              }
            }
          } else {
            switch (this.formData.get('trangThai').value) {
              case STATUS.CHUA_TONG_HOP: {
                body.trangThai = STATUS.DA_TONG_HOP;
                break;
              }
            }
          }
          let res = await this.dauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DUYET_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }


  async guiDuyetCuc() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThai: '',
            ngayPduyet: this.formData.value.ngayPduyet
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.TU_CHOI_LDC:
            case STATUS.TU_CHOI_TP:
            case STATUS.DU_THAO: {
              body.trangThai = STATUS.CHO_DUYET_TP;
              break;
            }
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.CHO_DUYET_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_LDC;
              break;
            }
          }
          let res = await this.dauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.DUYET_SUCCESS,
            );
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'TỪ CHỐI PHÊ DUYỆT',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: '',
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.CHO_DUYET_TP: {
              body.trangThai = STATUS.TU_CHOI_TP;
              break;
            }
            case STATUS.CHO_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_LDC;
              break;
            }
            case STATUS.CHO_DUYET_LDV: {
              body.trangThai = STATUS.TU_CHOI_LDV;
              break;
            }
          }
          const res = await this.dauThauService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (type == 'bao-gia') {
      if (id == 0) {
        this.addModelBaoGia.taiLieu = [];
        this.addModelBaoGia.children = [];
      } else if (id > 0) {
        this.editBaoGiaCache[id].data.taiLieu = [];
        this.editBaoGiaCache[id].data.children = [];
        this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
      }
    } else if (type == 'co-so') {
      if (id == 0) {
        this.addModelCoSo.taiLieu = [];
        this.addModelCoSo.children = [];
      } else if (id > 0) {
        this.editCoSoCache[id].data.taiLieu = [];
        this.editCoSoCache[id].data.children = [];
        this.checkDataExistCoSo(this.editCoSoCache[id].data);
      }
    }
  }

  openFile(event, id, type) {
    let item = {
      id: new Date().getTime(),
      text: event.name,
    };
    this.uploadFileService
      .uploadFile(event.file, event.name)
      .then((resUpload) => {
        const fileDinhKem = new FileDinhKem();
        fileDinhKem.fileName = resUpload.filename;
        fileDinhKem.fileSize = resUpload.size;
        fileDinhKem.fileUrl = resUpload.url;
        const lastPeriodIndex = resUpload.filename.lastIndexOf(".");
        let fileName = '';
        if (lastPeriodIndex !== -1) {
          fileName = resUpload.filename.slice(0, lastPeriodIndex);
        } else {
          fileName = resUpload.filename;
        }
        fileDinhKem.noiDung = fileName
        if (type == 'bao-gia') {
          if (id == 0) {
            if (this.addModelBaoGia.tenTlieu == null || this.addModelBaoGia.tenTlieu == '') {
              this.addModelBaoGia.tenTlieu = fileName;
            }
            this.addModelBaoGia.taiLieu = [];
            this.addModelBaoGia.taiLieu = [
              ...this.addModelBaoGia.taiLieu,
              item,
            ];
            this.addModelBaoGia.children = [];
            this.addModelBaoGia.children = [
              ...this.addModelBaoGia.children,
              fileDinhKem,
            ];
          } else if (id > 0) {
            if (this.editBaoGiaCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == '') {
              this.editBaoGiaCache[id].data.tenTlieu = fileName;
            }
            this.editBaoGiaCache[id].data.taiLieu = [];
            this.editBaoGiaCache[id].data.taiLieu = [
              ...this.editBaoGiaCache[id]?.data?.taiLieu,
              item,
            ];
            this.editBaoGiaCache[id].data.children = [];
            this.editBaoGiaCache[id].data.children = [
              ...this.editBaoGiaCache[id].data.children,
              fileDinhKem,
            ];
          }
        } else if (type == 'co-so') {
          if (id == 0) {
            if (this.addModelCoSo.tenTlieu == null || this.addModelCoSo.tenTlieu == '') {
              this.addModelCoSo.tenTlieu = fileName;
            }
            this.addModelCoSo.taiLieu = [];
            this.addModelCoSo.taiLieu = [...this.addModelCoSo.taiLieu, item];
            this.addModelCoSo.children = [];
            this.addModelCoSo.children = [
              ...this.addModelCoSo.children,
              fileDinhKem,
            ];
          } else if (id > 0) {
            if (this.editCoSoCache[id].data.tenTlieu == null || this.editBaoGiaCache[id].data.tenTlieu == '') {
              this.editCoSoCache[id].data.tenTlieu = fileName;
            }
            this.editCoSoCache[id].data.taiLieu = [];
            this.editCoSoCache[id].data.taiLieu = [
              ...this.editCoSoCache[id]?.data?.taiLieu,
              item,
            ];
            this.editCoSoCache[id].data.children = [];
            this.editCoSoCache[id].data.children = [
              ...this.editCoSoCache[id].data.children,
              fileDinhKem,
            ];
          }
        }
      });
  }

  addBaoGia() {
    // if (this.addModelBaoGia.taiLieu == null || this.addModelBaoGia.taiLieu == '') {
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     'Vui lòng nhập file đính kèm',
    //   );
    //   return;
    // }
    const taiLieuBaoGiaThiTruong = new CanCuXacDinh();
    taiLieuBaoGiaThiTruong.loaiCanCu = '00';
    taiLieuBaoGiaThiTruong.tenTlieu = this.addModelBaoGia.tenTlieu;
    taiLieuBaoGiaThiTruong.id = new Date().getTime() + 1;
    taiLieuBaoGiaThiTruong.children = this.addModelBaoGia.children;
    taiLieuBaoGiaThiTruong.taiLieu = this.addModelBaoGia.taiLieu;
    this.checkDataExistBaoGia(taiLieuBaoGiaThiTruong);
    this.clearBaoGia();
  }

  clearBaoGia() {
    this.addModelBaoGia = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
    };
  }

  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  deleteRowBaoGia(data) {
    this.baoGiaThiTruongList = this.baoGiaThiTruongList.filter(
      (x) => x.id != data.id,
    );
  }

  cancelEditBaoGia(id: number): void {
    const index = this.baoGiaThiTruongList.findIndex((item) => item.id === id);
    this.editBaoGiaCache[id] = {
      data: {...this.baoGiaThiTruongList[index]},
      edit: false,
    };
  }

  saveEditBaoGia(id: number): void {
    this.editBaoGiaCache[id].edit = false;
    this.checkDataExistBaoGia(this.editBaoGiaCache[id].data);
  }

  updatEditBaoGiaCache(): void {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      this.baoGiaThiTruongList.forEach((item) => {
        this.editBaoGiaCache[item.id] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  checkDataExistBaoGia(data) {
    if (this.baoGiaThiTruongList && this.baoGiaThiTruongList.length > 0) {
      let index = this.baoGiaThiTruongList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.baoGiaThiTruongList.splice(index, 1);
      }
    } else {
      this.baoGiaThiTruongList = [];
    }
    this.baoGiaThiTruongList = [...this.baoGiaThiTruongList, data];
    this.updatEditBaoGiaCache();
  }

  addCoSo() {
    // if (this.addModelCoSo.taiLieu == null || this.addModelCoSo.taiLieu == '') {
    //   this.notification.error(
    //     MESSAGE.ERROR,
    //     'Vui lòng nhập file đính kèm',
    //   );
    //   return;
    // }
    const taiLieuCanCuKhac = new CanCuXacDinh();
    taiLieuCanCuKhac.loaiCanCu = '01';
    taiLieuCanCuKhac.tenTlieu = this.addModelCoSo.tenTlieu;
    taiLieuCanCuKhac.id = new Date().getTime() + 1;
    taiLieuCanCuKhac.children = this.addModelCoSo.children;
    taiLieuCanCuKhac.taiLieu = this.addModelCoSo.taiLieu;
    this.checkDataExistCoSo(taiLieuCanCuKhac);
    this.clearCoSo();
  }

  clearCoSo() {
    this.addModelCoSo = {
      tenTlieu: '',
      taiLieu: [],
      children: [],
    };
  }

  editRowCoSo(id) {
    this.editCoSoCache[id].edit = true;
  }

  deleteRowCoSo(data) {
    this.canCuKhacList = this.canCuKhacList.filter((x) => x.id != data.id);
  }

  cancelEditCoSo(id: number): void {
    const index = this.canCuKhacList.findIndex((item) => item.id === id);
    this.editCoSoCache[id] = {
      data: {...this.canCuKhacList[index]},
      edit: false,
    };
  }

  saveEditCoSo(id: number): void {
    this.editCoSoCache[id].edit = false;
    this.checkDataExistCoSo(this.editCoSoCache[id].data);
  }

  updatEditCoSoCache(): void {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      this.canCuKhacList.forEach((item) => {
        this.editCoSoCache[item.id] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  checkDataExistCoSo(data) {
    if (this.canCuKhacList && this.canCuKhacList.length > 0) {
      let index = this.canCuKhacList.findIndex((x) => x.id == data.id);
      if (index != -1) {
        this.canCuKhacList.splice(index, 1);
      }
    } else {
      this.canCuKhacList = [];
    }
    this.canCuKhacList = [...this.canCuKhacList, data];
    this.updatEditCoSoCache();
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

  isDisbleForm(): boolean {
    if (this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP || this.formData.value.trangThai == STATUS.TU_CHOI_LDC) {
      return false
    } else {
      return true
    }
  }

  calcTongSl() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum;
    }
  }

  calcTongThanhTienDx() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTien() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGia;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }

  calcTongThanhTienBaoLanh() {
    if (this.listOfData) {
      let sum = 0
      this.listOfData.forEach(item => {
        const sumChild = item.children.reduce((prev, cur) => {
          prev += cur.soLuong * cur.donGiaTamTinh * this.formData.value.gtriDthau / 100;
          return prev;
        }, 0);
        sum += sumChild;
      })
      return sum * 1000;
    }
  }


  initListQuy() {
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth();
    const quarters = [1,2,3,4];

    // for (let quarter = 1; quarter <= 4; quarter++) {
    //   if (this.formData.get('namKhoach').value < currentYear || (this.formData.get('namKhoach').value === currentYear && quarter <= Math.ceil((currentMonth + 1) / 3))) {
    //     quarters.push(quarter);
    //   }
    // }
    this.listQuy = [];
    for (const element of quarters) {
      this.listQuy.push({giaTri: "Quý " + element + "/" + this.formData.get("namKhoach").value, ma: element})
    }
  }

  disabledDate = (current: Date): boolean => {
    const startDate = new Date(this.formData.get("namKhoach").value, (this.formData.get("quy").value - 1) * 3, 1);
    const endDate = new Date(this.formData.get("namKhoach").value, this.formData.get("quy").value * 3, 0);
    return current < startDate || current > endDate;
  };

  onChangeQuy() {
    this.formData.get("tgianBdauTchuc").setValue(null);
  }

  async danhSachGthauTruot($event) {
    $event.stopPropagation();
    if (this.formData.value.loaiVthh == null) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng chọn loại hàng DTQG.");
      return;
    }
    let body = {
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: this.formData.value.cloaiVthh,
      namKhoach: this.formData.value.namKhoach,
    }
    await this.dauThauService.danhSachGthauTruot(body).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listOfData = res.data;
        this.tinhTongMucDtDx()
      }
    })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  handleChoose(event) {
    let vat = this.listVat.find(item=> item.ma = event)
    this.formData.patchValue({
      thueVat: vat?.giaTri * 100
    })
  }
}
