import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {TYPE_PAG} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {STATUS} from 'src/app/constants/status';
import {CanCuXacDinhPag, ThongTinChungPag} from 'src/app/models/DeXuatPhuongAnGia';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UserLogin} from 'src/app/models/userlogin';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {DeXuatPAGService} from 'src/app/services/ke-hoach/phuong-an-gia/deXuatPAG.service';
import {HelperService} from 'src/app/services/helper.service';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {
  DialogTableSelectionComponent
} from "../../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {DonviService} from "../../../../../../../services/donvi.service";
import {
  TongHopPhuongAnGiaService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";
import {CurrencyMaskInputMode} from "ngx-currency";
import {
  QuyetDinhGiaCuaBtcService
} from "../../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";


@Component({
  selector: 'app-them-dx-pag-lt',
  templateUrl: './them-dx-pag-lt.component.html',
  styleUrls: ['./them-dx-pag-lt.component.scss']
})
export class ThemDeXuatPagLuongThucComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input() isModal: boolean;
  @Input() pagType: string;
  @Input() idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  @Input() type: string;
  isDieuChinh: boolean = true;
  templateName = 'de-xuat-phuong-an-gia';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  rowItemTtc: ThongTinChungPag = new ThongTinChungPag();
  dataEditTtc: { [key: string]: { edit: boolean; data: ThongTinChungPag } } = {};
  STATUS = STATUS;
  isGiaMuaToiDa: boolean = false;
  isVat: boolean = false;
  isApDungTatCa: boolean = false;
  fileDinhKem: any[] = [];
  formData: FormGroup;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsHangHoa: any[] = [];
  pagTtChungs: any[] = []
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  dsDiaDiemDeHang: any[] = [];
  dataTableKqGia: any[];
  dataTableTtThamKhao: any[];
  dsPhuongAnGia: any[] = [];
  dsLoaiHangXdg: any[] = [];
  listQdCtKh: any[] = [];
  listDxCanSua: any[] = [];
  detailNhaphang: any;
  maDx: string;
  typeConst = TYPE_PAG
  dataTableCanCuXdg: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();
  dataEdit: { [key: string]: { edit: boolean; data: CanCuXacDinhPag } } = {};
  listCtieuKeHoach: any[];
  dataChiTieu: any;
  dataTableKsGia: any[];
  fileDkPhanTich: any[] = [];
  dsChiCuc: any[] = [];
  listVat: any[];
  giaDn: number = 0;


  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    public donViService: DonviService,
    private helperService: HelperService,
    private deXuatPAGService: DeXuatPAGService,
    private tongHopPagService: TongHopPhuongAnGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year')],
        soDeXuat: [''],
        soDeXuatDc: [''],
        loaiVthh: [null],
        ngayKy: [null],
        loaiGia: [''],
        trichYeu: [null],
        soCanCu: [null],
        lanDeXuat: [1],
        qdCtKhNam: [null],
        trangThai: ['00'],
        tenTrangThai: ['Dự Thảo'],
        tenCloaiVthh: [null],
        cloaiVthh: [null],
        moTa: [null],
        apDungTatCa: [false],
        tchuanCluong: [''],
        giaDeNghi: [null],
        vat: [null],
        giaDeNghiVat: [null],
        soLuong: [],
        ghiChu: [],
        diaDiemDeHang: [null],
        //Form căn cứ phương pháp xác định giá
        maPphapXdg: [null],
        loaiHangXdg: ['XDG_LH01'],
        giaVonNk: [null],
        chiPhiChung: [null],
        chiPhiPbo: [null],
        tongChiPhi: [null],
        noiDung: [null],
        lyDoTuChoi: [null],
        tgianNhang: [null]
      }
    );

    this.formData.controls['giaVonNk'].valueChanges.subscribe(value => {
      const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value + this.formData.controls.chiPhiPbo.value
      this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
    })
    this.formData.controls['chiPhiChung'].valueChanges.subscribe(value => {
      if (this.formData.value.loaiHangXdg == 'XDG_LH02') {
        const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value - this.formData.controls.chiPhiPbo.value
        this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
      } else {
        const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value
        this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
      }

    })
    this.formData.controls['chiPhiPbo'].valueChanges.subscribe(value => {
      const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value - this.formData.controls.chiPhiPbo.value
      this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
    })
  }

  async ngOnInit() {
    this.spinner.show();
    this.isGiaMuaToiDa = this.type == TYPE_PAG.GIA_MUA_TOI_DA ? true : false;
    this.userInfo = this.userService.getUserLogin();
    this.maDx = '/' + this.userInfo.DON_VI.tenVietTat + '-KH&QLHDT';
    this.loadDsNam();
    this.loadDsLoaiGia();
    this.loadTiLeThue();
    this.loadDsPhuongAnGia();
    this.loadDsHangHoaPag();
    this.loadDsVthh();
    this.loadDsDxCanSua();
    this.getDataChiTieu(this.formData.value.namKeHoach);
    await this.getDataDetail(this.idInput)
    this.spinner.hide();
  }

  async loadTiLeThue() {
    this.spinner.show();
    try {
      let res = await this.danhMucService.danhMucChungGetAll("THUE_SUAT_VAT");
      if (res.msg == MESSAGE.SUCCESS) {
        this.listVat = res.data;
        if (this.listVat && this.listVat.length > 0) {
          this.listVat.sort((a, b) => (a.giaTri - b.giaTri))
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.deXuatPAGService.getDetail(id);
      const data = res.data;
      this.maDx = data.soDeXuat ? '/' + data.soDeXuat.split('/')[1] : '/' + this.userInfo.DON_VI.tenVietTat + '-KH&QLHDT';
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat ? data.soDeXuat.split('/')[0] : '',
        soDeXuatDc: data.soDeXuatDc,
        lanDeXuat: data.lanDeXuat,
        loaiVthh: data.loaiVthh,
        ngayKy: data.ngayKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        cloaiVthh: data.cloaiVthh,
        tenCloaiVthh: data.tenCloaiVthh,
        moTa: data.moTa,
        tchuanCluong: data.tchuanCluong,
        giaDeNghi: data.giaDeNghi,
        vat: data.vat ? data.vat.toString() : '',
        giaDeNghiVat: data.giaDeNghiVat,
        soLuong: data.soLuong,
        ghiChu: data.ghiChu,
        diaDiemDeHang: data.diaDiemDeHang,
        maPphapXdg: data.maPphapXdg,
        loaiHangXdg: data.loaiHangXdg,
        giaVonNk: data.giaVonNk,
        chiPhiChung: data.chiPhiChung,
        chiPhiPbo: data.chiPhiPbo,
        tongChiPhi: data.tongChiPhi,
        noiDung: data.noiDung,
        tgianNhang: data.tgianNhang,
        soCanCu: data.soCanCu,
        qdCtKhNam: data.qdCtKhNam,
        tenTrangThai: data.tenTrangThai,
        lyDoTuChoi: data.lyDoTuChoi,
        apDungTatCa: data.apDungTatCa
      })
      this.dataTableCanCuXdg = data.canCuPhapLy;
      this.dsDiaDiemDeHang = data.diaDiemDeHangs;
      this.pagTtChungs = data.pagTtChungs;
      this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
      this.dataTableKqGia = data.ketQuaThamDinhGia;
      this.dataTableTtThamKhao = data.ketQuaKhaoSatTtThamKhao;
      this.fileDinhKem = data.fileDinhKems;
      this.fileDkPhanTich = data.filePhanTich;
      this.isApDungTatCa = data.apDungTatCa;
      if (this.isApDungTatCa == true) {
        this.giaDn = this.pagTtChungs[0]?.giaDn
      }
      this.updateEditCache();
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG01' || item.ma == 'LG02'
        );
      }
      if (this.type == TYPE_PAG.GIA_CU_THE) {
        this.dsLoaiGia = res.data.filter(item =>
          item.ma == 'LG03' || item.ma == 'LG04'
        );
      }
    }
  }


  async loadDsPhuongAnGia() {
    this.dsPhuongAnGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('PP_XDG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsPhuongAnGia = res.data;
    }
  }

  async loadDsHangHoaPag() {
    this.dsLoaiHangXdg = [];
    let res = await this.danhMucService.danhMucChungGetAll('PP_XDG_LOAI_HANG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiHangXdg = res.data;
    }
  }

  async getDataChiTieu(namKh) {
    if (!this.idInput) {
      let res = await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(+namKh)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataChiTieu = res.data;
        if (dataChiTieu) {
          this.dataChiTieu = dataChiTieu;
        } else {
          this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy chỉ tiêu kế hoạch năm ' + dayjs().get('year'))
          return;
        }
      }
    }
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != '02');
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      await this.loadDsChiCuc();
      if (event.startsWith("01")) {
        this.listCtieuKeHoach = this.dataChiTieu && this.dataChiTieu.khLuongThuc && this.dataChiTieu.khLuongThuc.length > 0 ? this.dataChiTieu.khLuongThuc : [];
      }
      if (event.startsWith("04")) {
        this.listCtieuKeHoach = this.dataChiTieu && this.dataChiTieu.khMuoiDuTru && this.dataChiTieu.khMuoiDuTru.length > 0 ? this.dataChiTieu.khMuoiDuTru : [];
      }
      if (this.listCtieuKeHoach && this.listCtieuKeHoach.length > 0 && this.isDieuChinh) {
        if (this.pagTtChungs && this.pagTtChungs.length > 0) {
          this.pagTtChungs.forEach((pagTtChung, index) => {
            pagTtChung.soLuong = 0;
            pagTtChung.soLuongCtieu = ''
            let ctieuChiCuc = this.listCtieuKeHoach.find(ctieu => ctieu.maDonVi == pagTtChung.maChiCuc);
            if (ctieuChiCuc) {
              if ((this.formData.value.loaiGia && (this.formData.value.loaiGia == 'LG02' || this.formData.value.loaiGia == 'LG04'))) {
                if (event.startsWith("0101")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.xtnTongThoc ? ctieuChiCuc.xtnTongThoc : 0
                }
                if (event.startsWith("0102")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.xtnTongGao ? ctieuChiCuc.xtnTongGao : 0
                }
                if (event.startsWith("04")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.xuatTrongNamMuoi ? ctieuChiCuc.xuatTrongNamMuoi : 0
                }
              }
              if ((this.formData.value.loaiGia && (this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03'))) {
                if (event.startsWith("0101")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.ntnThoc ? ctieuChiCuc.ntnThoc : 0
                }
                if (event.startsWith("0102")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.ntnGao ? ctieuChiCuc.ntnGao : 0
                }
                if (event.startsWith("04")) {
                  pagTtChung.soLuongCtieu = ctieuChiCuc.nhapTrongNam ? ctieuChiCuc.nhapTrongNam : 0
                }
                if (ctieuChiCuc && ctieuChiCuc.xtnThoc && ctieuChiCuc.xtnThoc.length > 0) {
                  let xtn = ctieuChiCuc.xtnThoc.filter(xuat => xuat.nam == this.formData.value.namKeHoach);
                  if (xtn && xtn.length > 0) {
                    pagTtChung.soLuongCtieu = xtn?.soLuong
                  }
                }
              }
            }
          })
          this.pagTtChungs = this.pagTtChungs.filter(pagTtChung => !(pagTtChung.soLuongCtieu == null || pagTtChung.soLuongCtieu == 0 || pagTtChung.soLuongCtieu == ''));
        }
      }
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else {
      this.pagTtChungs = [];
    }
  }

  async onChangeCloaiVthh(event) {
    let listQdBtc = [];
    if (this.formData.value.namKeHoach && this.formData.value.loaiVthh && this.formData.value.cloaiVthh && this.formData.value.loaiGia && this.type == 'GCT') {
      let body = {
        namKeHoach: this.formData.value.namKeHoach,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
        loaiGia: this.formData.value.loaiGia == 'LG03' ? 'LG01' : 'LG02',
        maDvi: this.userInfo.MA_DVI,
      }
      let res = await this.quyetDinhGiaCuaBtcService.getQdGiaLastestBtc(body);
      if (res.msg === MESSAGE.SUCCESS) {
        if (res.data) {
          listQdBtc = res.data && res.data.length ? res.data : [];
        }
      }
    }
    this.pagTtChungs.forEach(item => {
      item.cloaiVthh = event;
      let itemBtc = listQdBtc.find(it => it.maChiCuc == item.maChiCuc);
      if (itemBtc) {
        item.soLuong = itemBtc.soLuong
      }
    })
    let list = this.listCloaiVthh.filter(item => item.ma == event)
    this.formData.patchValue({
      tenCloaiVthh: list && list.length > 0 ? list[0].ten : ''
    })
    let resp = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
    if (resp.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: resp.data && resp.data.tieuChuanCl ? resp.data.tieuChuanCl : ""
      })
    }
  }

  getNameFile(event?: any, tableName?: string, item?: FileDinhKem,) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      const itemFile = {
        name: fileList[0].name,
        file: event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          if (item) {
            item.fileName = resUpload.filename;
            item.fileSize = resUpload.size;
            item.fileUrl = resUpload.url;
          } else {
            if (!this.rowItemCcXdg.fileDinhKem) {
              this.rowItemCcXdg.fileDinhKem = new FileDinhKem();
            }
            this.rowItemCcXdg.fileDinhKem.fileName = resUpload.filename;
            this.rowItemCcXdg.fileDinhKem.fileSize = resUpload.size;
            this.rowItemCcXdg.fileDinhKem.fileUrl = resUpload.url;
            this.rowItemCcXdg.fileDinhKem.idVirtual = new Date().getTime();
          }
        });
    }
  }

  onChangeLoaiGia($event) {
    this.isVat = ($event == 'LG01' || $event == 'LG03');
    this.formData.patchValue({
      cloaiVthh: null
    })
    if (this.formData.value.loaiVthh) {
      this.onChangeLoaiVthh(this.formData.value.loaiVthh);
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
    }
  }


  downloadFile(item: FileDinhKem) {
    this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
      saveAs(blob, item.fileName);
    });
  }

  quayLai() {
    this.onClose.emit();
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.removeValidators(this.formData);
    this.setValidator()
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    this.updatePagTtChungs();
    let body = this.formData.value;
    if (body.soDeXuat) {
      body.soDeXuat = body.soDeXuat + this.maDx;
    } else {
      body.soDeXuat = ''
    }
    body.apDungTatCa = this.isApDungTatCa;
    body.canCuPhapLy = this.dataTableCanCuXdg;
    body.ketQuaKhaoSatGiaThiTruong = this.dataTableKsGia;
    body.ketQuaThamDinhGia = this.dataTableKqGia;
    body.pagTtChungs = this.pagTtChungs;
    body.ketQuaKhaoSatTtThamKhao = this.dataTableTtThamKhao;
    body.diaDiemDeHangs = this.dsDiaDiemDeHang;
    body.fileDinhKemReqs = this.fileDinhKem;
    body.filePhanTich = this.fileDkPhanTich;
    body.type = this.type;
    body.maDvi = this.userInfo.MA_DVI
    let res
    if (this.idInput > 0) {
      res = await this.deXuatPAGService.update(body);
    } else {
      res = await this.deXuatPAGService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.quayLai();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  setValidator() {
    this.formData.controls["namKeHoach"].setValidators([Validators.required]);
    this.formData.controls["soDeXuat"].setValidators([Validators.required]);
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["ngayKy"].setValidators([Validators.required]);
    this.formData.controls["loaiGia"].setValidators([Validators.required]);
    this.formData.controls["maPphapXdg"].setValidators([Validators.required]);
    if (this.type == TYPE_PAG.GIA_MUA_TOI_DA) {
      this.formData.controls["noiDung"].setValidators([Validators.required]);
    }
    if (this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03') {
      this.formData.controls["vat"].setValidators([Validators.required]);
    }
  }

  async pheDuyet() {
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
            trangThai: ''
          };
          switch (this.formData.get('trangThai').value) {
            case STATUS.DU_THAO:
            case STATUS.TU_CHOI_TP:
            case STATUS.TU_CHOI_LDC: {
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
            case STATUS.DA_DUYET_LDC: {
              body.trangThai = STATUS.DA_DUYET_CBV;
              break;
            }
          }
          let res = await this.deXuatPAGService.approve(body)
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
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

  async tuChoi() {
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
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: ''
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
            case STATUS.DA_DUYET_LDC: {
              body.trangThai = STATUS.TU_CHOI_CBV;
              break;
            }
          }
          let res = await this.deXuatPAGService.approve(body);
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

  required(): string {
    let message;
    if (!this.rowItemCcXdg.moTa || !this.rowItemCcXdg.fileDinhKem) {
      message = 'Vui lòng nhập đủ thông tin'
    }
    return message;
  }

  themDataTable() {
    let msgRequired = this.required();
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    this.dataTableCanCuXdg = [...this.dataTableCanCuXdg, this.rowItemCcXdg];
    this.rowItemCcXdg = new CanCuXacDinhPag();
    this.updateEditCache();
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  cancelEdit(index: number) {
    this.dataEdit[index] = {
      data: {...this.dataTableCanCuXdg[index]},
      edit: false,
    };
  }

  saveEdit(idx: number) {

  }

  deleteItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTableCanCuXdg.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(): void {
    if (this.dataTableCanCuXdg) {
      this.dataTableCanCuXdg.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  onChangePp() {
    if (this.formData.value.loaiHangXdg == 'XDG_LH02') {
      let tong = +this.formData.get('giaVonNk').value + this.formData.get('chiPhiChung').value - this.formData.get('chiPhiPbo').value
      this.formData.get('tongChiPhi').setValue(tong)
    } else {
      let tong = this.formData.get('chiPhiChung').value + this.formData.get('giaVonNk').value
      this.formData.get('tongChiPhi').setValue(tong)
    }
  }

  async loadDsDxCanSua() {
    this.spinner.show();
    this.listDxCanSua = [];
    try {
      let body = {
        namKh: this.formData.value.namKeHoach,
        type: this.type,
        loaiDeXuat: "01",
        maDvi: this.userInfo.MA_DVI,
        pagType: this.pagType
      }
      let res = await this.tongHopPagService.loadToTrinhDeXuat(body);
      if (res.msg = MESSAGE.SUCCESS) {
        this.listDxCanSua = res.data;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  openModalSoDx() {
    if (!this.idInput && !this.isModal) {
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách điều chỉnh đề xuất Phương án giá',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDxCanSua,
          dataHeader: ['Số công văn', 'Ngày ký', 'Loại hàng DTQG', 'Chủng loại hàng DTQG'],
          dataColumn: ['soDeXuat', 'ngayKy', 'tenLoaiVthh', 'tenCloaiVthh'],
        },
      })
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          this.isDieuChinh = false;
          await this.bindingDataQd(data.id);
        }
      });
    }
  }

  async bindingDataQd(id) {
    let res = await this.deXuatPAGService.getDetail(id);
    const data = res.data;
    this.formData.patchValue({
      namKeHoach: data.namKeHoach,
      soDeXuatDc: data.soDeXuat,
      loaiVthh: data.loaiVthh,
      loaiGia: data.loaiGia,
      cloaiVthh: data.cloaiVthh,
      tchuanCluong: data.tchuanCluong,
      vat: data.vat ? data.vat.toString() : '',
      soCanCu: data.soCanCu,
      qdCtKhNam: data.qdCtKhNam,
      type: data.type,
      lanDeXuat: data.lanDeXuat > 0 ? data.lanDeXuat + 1 : 1
    })
    this.pagTtChungs = data.pagTtChungs;
    this.isApDungTatCa = data.apDungTatCa;
    if (this.isApDungTatCa == true) {
      this.giaDn = this.pagTtChungs[0]?.giaDn
    }
    this.updateEditCache();
  }

  onChangeIsApDungTatCa(event) {
    if (event == true) {
      this.pagTtChungs.forEach(item => {
        item.giaDn = this.giaDn;
      })
    }
    this.formData.patchValue({
      apDungTatCa: event
    })
  }

  async loadDsChiCuc() {
    if (!this.idInput && this.isDieuChinh) {
      let res = await this.donViService.layTatCaDonViByLevel(3);
      if (res && res.data) {
        this.dsChiCuc = res.data;
        this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI));
        this.pagTtChungs = [];
        this.dsChiCuc.forEach(item => {
          this.rowItemTtc.maChiCuc = item?.maDvi;
          this.rowItemTtc.tenChiCuc = item?.tenDvi;
          this.pagTtChungs.push(this.rowItemTtc);
          this.rowItemTtc = new ThongTinChungPag();
        })
      }
    }
  }

  async changeChiCuc(event) {
    let list = this.dsChiCuc.filter(item => item.maDvi == event)
    if (list && list.length > 0) {
      this.rowItemTtc.tenChiCuc = list[0]?.tenDvi
    }
  }

  updatePagTtChungs() {
    this.pagTtChungs.forEach(item => {
      if (this.formData.value.vat && ((this.formData.value.loaiGia == 'LG01' || this.formData.value.loaiGia == 'LG03'))) {
        item.giaDnVat = item.giaDn + item.giaDn * this.formData.value.vat
      }
    })
  }

  async changeNamKh($event) {
    await this.getDataChiTieu($event);
    await this.onChangeLoaiVthh(this.formData.value.loaiVthh);
    this.loadDsDxCanSua()
  }

  calcTong(field: string) {
    if (this.pagTtChungs && this.pagTtChungs.length > 0) {
      const sum = this.pagTtChungs.reduce((prev, cur) => {
        prev += cur[field];
        return prev;
      }, 0);
      return sum;
    }
  }

  checkMaxValue(data: any): void {
    const maxAllowedValue = data.soLuongCtieu ? data.soLuongCtieu : 0;
    if (data.soLuong > maxAllowedValue) {
      data.soLuong = maxAllowedValue;
    }
  }


}




