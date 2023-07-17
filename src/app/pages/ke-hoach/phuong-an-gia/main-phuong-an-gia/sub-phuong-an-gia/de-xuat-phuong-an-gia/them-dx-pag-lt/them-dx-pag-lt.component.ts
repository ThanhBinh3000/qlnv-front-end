import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogDdiemDeHangComponent
} from 'src/app/components/dialog/dialog-ddiem-de-hang/dialog-ddiem-de-hang.component';
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
import {AMOUNT} from "../../../../../../../Utility/utils";


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
  @Input()  dviTinh: string;

  amount = AMOUNT;
  rowItemTtc: ThongTinChungPag = new ThongTinChungPag();
  dataEditTtc: { [key: string]: { edit: boolean; data: ThongTinChungPag } } = {};
  STATUS = STATUS;
  isGiaMuaToiDa: boolean = false;
  isVat: boolean = false;
  fileDinhKem: any[] = [];
  formData: FormGroup;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsHangHoa: any[] = [];
  pagTtChungs: any[] = []
  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  listQdGoc: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  dsDiaDiemDeHang: any[] = [];
  dataTableKqGia: any[];
  dataTableTtThamKhao: any[];
  dsPhuongAnGia: any[] = [];
  dsLoaiDx: any[] = [];
  dsLoaiHangXdg: any[] = [];
  listQdCtKh: any[] = [];
  listDxCanSua: any[] = [];
  detailNhaphang: any;
  maDx: string;
  typeConst = TYPE_PAG
  dataTableCanCuXdg: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();
  dataEdit: { [key: string]: { edit: boolean; data: CanCuXacDinhPag } } = {};

  dataTableKsGia: any[];
  fileDkPhanTich: any[] = [];
  dsChiCuc: any[] = [];
  listVat: any[];


  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    public donViService: DonviService,
    private helperService: HelperService,
    private deXuatPAGService: DeXuatPAGService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soDeXuat: ['', [Validators.required]],
        soDeXuatDc: [''],
        loaiVthh: [null, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        loaiGia: ['', [Validators.required]],
        trichYeu: [null],
        soCanCu: [null],
        loaiDeXuat: ['00',[Validators.required] ],
        qdCtKhNam: [null],
        trangThai: ['00'],
        tenTrangThai: ['Dự Thảo'],
        tenCloaiVthh: [null],
        cloaiVthh: [null],
        moTa: [null],
        apDungTatCa: [false,  [Validators.required]],
        tchuanCluong: [''],
        giaDeNghi: [null],
        vat: [null],
        giaDeNghiVat: [null],
        soLuong: [],
        ghiChu: [],
        diaDiemDeHang: [null],
        //Form căn cứ phương pháp xác định giá
        maPphapXdg: [null, [Validators.required]],
        loaiHangXdg: [],
        giaVonNk: [],
        chiPhiChung: [],
        chiPhiPbo: [],
        tongChiPhi: [],
        noiDung: [null],
        lyDoTuChoi: [],
        tgianNhang: []
      }
    );
    this.formData.controls['giaDeNghi'].valueChanges.subscribe(value => {
      const gtriHdSauVat = this.formData.controls.giaDeNghi.value + (this.formData.controls.giaDeNghi.value* this.formData.controls.vat.value);
      this.formData.controls['giaDeNghiVat'].setValue(gtriHdSauVat);
    });
    this.formData.controls['vat'].valueChanges.subscribe(value => {
      const gtriHdSauVat = this.formData.controls.giaDeNghi.value + (this.formData.controls.giaDeNghi.value * this.formData.controls.vat.value);
      this.formData.controls['giaDeNghiVat'].setValue(gtriHdSauVat);
    })
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
      this.isGiaMuaToiDa = this.type == TYPE_PAG.GIA_MUA_TOI_DA;
      this.userInfo = this.userService.getUserLogin();
      this.maDx = '/' + this.userInfo.DON_VI.tenVietTat + '-KH&QLHDT';
      this.loadDsNam();
      this.loadDsLoaiGia();
      this.loadDsLoaiDx();
      this.loadTiLeThue();
      this.loadDsPhuongAnGia();
      this.loadDsHangHoaPag();
      this.loadDsVthh();
      this.loadDsDxCanSua();
      this.loadDsChiCuc();
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
          this.listVat.sort((a,b) => (a.giaTri - b.giaTri))
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // async loadDsQdPduyetKhlcnt() {
  //   if (this.type == 'GCT') {
  //     let body = {
  //       namKeHoach: this.formData.value.namKeHoach,
  //       maDvi: this.userInfo.MA_DVI,
  //       loaiVthh: this.formData.value.loaiVthh,
  //       cloaiVthh: this.formData.value.cloaiVthh,
  //       trangThai: STATUS.BAN_HANH
  //     };
  //     let res = await this.deXuatPAGService.loadQdGiaoKhLcnt(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       let arr = res.data;
  //       if (arr) {
  //         this.listQdCtKh = arr;
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, 'Không tìm thấy kế hoạch lựa chọn nhà thầu năm ' + dayjs().get('year'))
  //       return;
  //     }
  //   }
  // }

  async loadDsQdPduyetKhBdg() {
    if (this.type == 'GCT') {
      let body = {
        namKeHoach: this.formData.value.namKeHoach,
        maDvi: this.userInfo.MA_DVI,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: this.formData.value.cloaiVthh,
        trangThai: STATUS.BAN_HANH
      };
      let res = await this.deXuatPAGService.loadQdGiaoKhBdg(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let arr = res.data;
        if (arr) {
          this.listQdCtKh = arr;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, 'Không tìm thấy kế hoạch bán đầu giá năm ' + dayjs().get('year'))
        return;
      }
    }
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.deXuatPAGService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat ? data.soDeXuat.split('/')[0] : '',
        soDeXuatDc: data.soDeXuatDc,
        loaiDeXuat: data.loaiDeXuat,
        loaiVthh: data.loaiVthh,
        ngayKy: data.ngayKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        cloaiVthh: data.cloaiVthh,
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
        apDungTatCa: data.apDungTatCa,
        lyDoTuChoi: data.lyDoTuChoi
      })
      // await this.loadDsQdPduyetKhlcnt();
      await this.loadDsQdPduyetKhBdg();
      this.dataTableCanCuXdg = data.canCuPhapLy;
      this.dsDiaDiemDeHang = data.diaDiemDeHangs;
      this.pagTtChungs = data.pagTtChungs;
      this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
      this.dataTableKqGia = data.ketQuaThamDinhGia;
      this.dataTableTtThamKhao = data.ketQuaKhaoSatTtThamKhao;
      this.fileDinhKem = data.fileDinhKems;
      this.fileDkPhanTich = data.filePhanTich;
      this.updateEditCache('ttc');
      this.updateEditCache('ppxdg');
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

  async loadDsLoaiDx() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_DE_XUAT');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiDx = res.data;
      if (this.dsLoaiDx.length > 0)  {
        this.dsLoaiDx.sort((a,b) => (a.ma - b.ma))
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

  async getDataChiTieu() {
    if (this.type == 'GMTDBTT' && !this.idInput) {
      let res2 = await this.chiTieuKeHoachNamCapTongCucService.chiTeuPag(+this.formData.get('namKeHoach').value)
      if (res2.msg == MESSAGE.SUCCESS) {
        const dataChiTieu = res2.data;
        if (dataChiTieu) {
          this.formData.patchValue({
            soCanCu: dataChiTieu.soQuyetDinh,
          });
        } else {
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy chỉ tiêu kế hoạch năm ' + dayjs().get('year'))
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
  }

  async onChangeCloaiVthh(event) {
    let list = this.listCloaiVthh.filter(item => item.ma == event)
    this.formData.patchValue({
      qdCtKhNam: null,
      tenCloaiVthh : list && list.length > 0 ? list[0].ten : ''
    })
    // if (this.formData.value.loaiGia == "LG03") {
    //   await this.loadDsQdPduyetKhlcnt();
    // }
    if (this.formData.value.loaiGia == "LG04") {
      await this.loadDsQdPduyetKhBdg();
    }
    this.dviTinh = '';
    let resp = await this.danhMucService.getDetail(this.formData.value.cloaiVthh);
    if (resp.msg == MESSAGE.SUCCESS) {
      this.dviTinh = resp.data.maDviTinh;
    }
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(
      this.formData.get('cloaiVthh').value,
    );
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.formData.patchValue({
          tchuanCluong: res.data.tenQchuan
        })
      }
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
      cloaiVthh : null
    })
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.dsNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  openFile(event) {
    // if (!this.isView) {
    //   let item = {
    //     id: new Date().getTime(),
    //     text: event.name,
    //   };
    //   if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
    //     this.uploadFileService
    //       .uploadFile(event.file, event.name)
    //       .then((resUpload) => {
    //         if (!this.deXuatDieuChinh.fileDinhKemReqs) {
    //           this.deXuatDieuChinh.fileDinhKemReqs = [];
    //         }
    //         const fileDinhKem = new FileDinhKem();
    //         fileDinhKem.fileName = resUpload.filename;
    //         fileDinhKem.fileSize = resUpload.size;
    //         fileDinhKem.fileUrl = resUpload.url;
    //         fileDinhKem.idVirtual = item.id;
    //         this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
    //         this.taiLieuDinhKemList.push(item);
    //       });
    //   }
    // }
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
    this.setValidator(isGuiDuyet)
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    /*if (this.detailNhaphang) {
      if (this.detailNhaphang.donGiaVat == 0) {
        this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đơn giá VAT ở quyết định giao kế hoạch mua bán")
        this.spinner.hide();
        return;
      } else {
        if (this.formData.value.loaiGia == "LG03") {
          if (this.formData.value.giaDeNghiVat > this.detailNhaphang.donGiaVat && this.formData.value.loaiGia == 'LG03') {
            this.notification.error(MESSAGE.ERROR, "Đơn giá VAT không được vượt mức so với quyết định giao kế hoạch mua bán!")
            this.spinner.hide();
            return;
          }
        }
        if (this.formData.value.loaiGia == "LG04") {
          if (this.formData.value.giaDeNghi < this.detailNhaphang.donGiaVat && this.formData.value.loaiGia == 'LG04') {
            this.notification.error(MESSAGE.ERROR, "Đơn giá VAT không được ít hơn so với quyết định giao kế hoạch mua bán!!!!")
            this.spinner.hide();
            return;
          }
        }
      }
    }*/
    this.updatePagTtChungs();
    let body = this.formData.value;
    if (body.soDeXuat) {
      body.soDeXuat = body.soDeXuat + this.maDx;
    } else {
      body.soDeXuat = ''
    }
    body.canCuPhapLy = this.dataTableCanCuXdg;
    body.ketQuaKhaoSatGiaThiTruong = this.dataTableKsGia;
    body.ketQuaThamDinhGia = this.dataTableKqGia;
    body.pagTtChungs = body.apDungTatCa == true ? [] : this.pagTtChungs;
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKeHoach"].setValidators([Validators.required]);
      this.formData.controls["soDeXuat"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["ngayKy"].setValidators([Validators.required]);
      this.formData.controls["loaiGia"].setValidators([Validators.required]);
      this.formData.controls["maPphapXdg"].setValidators([Validators.required]);
    } else {
      this.formData.controls["ngayKy"].clearValidators();
      this.formData.controls["maPphapXdg"].clearValidators();
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

  themMoiDiaDiem() {
    const modalGT = this.modal.create({
      nzTitle: 'Địa điểm để hàng',
      nzContent: DialogDdiemDeHangComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsDiaDiemDeHang,
        dviTinh: this.dviTinh
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      this.dsDiaDiemDeHang = res;
      this.convertDsDiemDeHang(res);
    });
  }

  convertDsDiemDeHang(dataTableDd) {
    let ddDeHang = '';
    let soLuong = 0;
    dataTableDd.forEach(item => {
      ddDeHang += item.tenDvi + "(" + item.soLuong + "), ",
        soLuong += item.soLuong
    })
    this.formData.patchValue({
      diaDiemDeHang: ddDeHang.substring(0, ddDeHang.length - 2),
      soLuong: soLuong
    })
  }

  required(page : string) : string {
    let message ;
    if(page == 'ttc') {
      if (!this.rowItemTtc.maChiCuc || !this.rowItemTtc.donViTinh || !this.rowItemTtc.soLuong || !this.rowItemTtc.giaDn) {
        message = 'Vui lòng nhập đủ thông tin'
      }
    } else if (page == 'ppxdg') {
      if (!this.rowItemCcXdg.moTa || !this.rowItemCcXdg.fileDinhKem) {
        message = 'Vui lòng nhập đủ thông tin'
      }
    }
    return message;
  }

  themDataTable(page : string) {
    if (page == 'ttc') {
      this.rowItemTtc.donViTinh = this.dviTinh;
    }
    let msgRequired = this.required(page);
    if (msgRequired) {
      this.notification.error(MESSAGE.ERROR, msgRequired);
      this.spinner.hide();
      return;
    }
    if (page == 'ttc') {
      this.pagTtChungs = [...this.pagTtChungs, this.rowItemTtc];
      this.rowItemTtc = new ThongTinChungPag();
      this.updateEditCache(page);
    }
    if (page == 'ppxdg') {
      this.dataTableCanCuXdg = [...this.dataTableCanCuXdg, this.rowItemCcXdg];
      this.rowItemCcXdg = new CanCuXacDinhPag();
      this.updateEditCache(page);
    }
  }

  startEdit(index: number, page :string) {
    if (page == 'ttc') {
      this.dataEditTtc[index].edit = true;
    }
    if (page == 'ppxdg') {
      this.dataEdit[index].edit = true;
    }
  }

  cancelEdit(index: number, page : string) {
    if (page == 'ttc') {
      this.dataEditTtc[index] = {
        data: {...this.pagTtChungs[index]},
        edit: false,
      };
    }
    if (page == 'ppxdg') {
      this.dataEdit[index] = {
        data: {...this.dataTableCanCuXdg[index]},
        edit: false,
      };
    }
  }

  saveEdit(idx: number, page : string) {

  }

  deleteItem(index: number, page  :string) {
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
          if (page == 'ppxdg') {
            this.dataTableCanCuXdg.splice(index, 1);
            this.updateEditCache(page);
          }
          if (page == 'ttc') {
            this.pagTtChungs.splice(index, 1);
            this.updateEditCache(page);
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  updateEditCache(page  :string): void {
    if(page == 'ttc') {
      if (this.pagTtChungs) {
        this.pagTtChungs.forEach((item, index) => {
          this.dataEditTtc[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
    }
    if(page == 'ppxdg') {
      if (this.dataTableCanCuXdg) {
        this.dataTableCanCuXdg.forEach((item, index) => {
          this.dataEdit[index] = {
            edit: false,
            data: {...item},
          };
        });
      }
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

  async loadDetailNh(event) {
    let arr = this.listQdCtKh.filter(item => item.soQd == event)
    if (arr) {
      this.detailNhaphang = arr[0]
      this.formData.patchValue({
        soLuong : this.detailNhaphang && this.detailNhaphang.soLuong ? this.detailNhaphang.soLuong : 0
      })
    }
  }

  async loadDsDxCanSua() {
    this.spinner.show();

    let body = {
      namKh : this.formData.value.namKeHoach,
      type : this.type,
      pagType : this.pagType,
      maDvi : this.userInfo.MA_DVI,
      paggingReq : {
        limit: 99999,
        page: 0,
      }
    }
    let res = await this.deXuatPAGService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listDxCanSua = data.content;
      if (this.listDxCanSua && this.listDxCanSua.length > 0) {
        this.listDxCanSua = this.listDxCanSua.filter(item => item.trangThai == STATUS.DA_DUYET_CBV);
      }
    }
    this.spinner.hide();
  }

  openModalSoDx() {
    if (!this.isView && !this.isModal) {
      const modalQD = this.modal.create({
        nzTitle: 'Danh sách điều chỉnh đề xuất Phương án giá',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: this.listDxCanSua,
          dataHeader: ['Số công văn', 'Ngày ký', 'Loại hàng hoa'],
          dataColumn: ['soDeXuat', 'ngayKy', 'tenLoaiVthh'],
        },
      })
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
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
       ngayKy: data.ngayKy,
       loaiGia: data.loaiGia,
       trichYeu: data.trichYeu,
       cloaiVthh: data.cloaiVthh,
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
     })
     // await this.loadDsQdPduyetKhlcnt();
     await this.loadDsQdPduyetKhBdg();
     this.dataTableCanCuXdg = data.canCuPhapLy;
     this.dsDiaDiemDeHang = data.diaDiemDeHangs;
     this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
     this.dataTableKqGia = data.ketQuaThamDinhGia;
     this.dataTableTtThamKhao = data.ketQuaKhaoSatTtThamKhao;
     this.fileDinhKem = data.fileDinhKems;
     this.fileDkPhanTich = data.filePhanTich;
     this.updateEditCache('ttc');
     this.updateEditCache('ppxdg');
  }

  onChangeIsApDungTatCa() {
    this.updateEditCache('ttc');
    this.updateEditCache('ppxdg');
  }

  async loadDsChiCuc() {
    let res = await this.donViService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

  async changeChiCuc(event) {
    let list = this.dsChiCuc.filter(item => item.maDvi == event)
    if(list && list.length > 0) {
      this.rowItemTtc.tenChiCuc = list[0]?.tenDvi
    }
  }

  updatePagTtChungs() {
    if (this.formData.value.apDungTatCa == true) {
      this.pagTtChungs = [];
    } else {
      this.formData.patchValue({
        giaDeNghi : null,
        giaDeNghiVat : null,
        soLuong : null,
        diaDiemDeHang : null,
      })
    }
  }
}


