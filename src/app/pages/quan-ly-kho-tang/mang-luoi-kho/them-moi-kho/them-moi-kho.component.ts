import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {OldResponseData} from 'src/app/interfaces/response';
import {HelperService} from 'src/app/services/helper.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {DonviService} from 'src/app/services/donvi.service';
import {LOAI_DON_VI, TrangThaiHoatDong} from 'src/app/constants/status';
import {UserLogin} from "../../../../models/userlogin";
import {UserService} from "../../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MangLuoiKhoService} from "../../../../services/qlnv-kho/mangLuoiKho.service";
import {Globals} from "../../../../shared/globals";


@Component({
  selector: 'app-them-moi-kho',
  templateUrl: './them-moi-kho.component.html',
  styleUrls: ['./them-moi-kho.component.scss']
})

export class ThemMoiKhoComponent implements OnInit {
  @ViewChild('treeSelect', {static: false}) treeSelect!: NzTreeComponent;

  data: any;
  loaiHangHoa: any = {
    "type": "LT",
    "loaiVthh": "",
    "cloaiVthh": "",
    "thoc": false,
    "gao": false,
    "muoi": false,
    "vattu": false,
  }
  idReq: number = 0;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formKho: FormGroup;
  formDvi: FormGroup;
  isVisible = false;
  levelNode: number = 0;
  userInfo: UserLogin
  regexMa = '^[0-9]$'

  dataDetail: any;
  nodeSelected: any;
  dataTable: any[] = [];
  dvi: string = 'Tấn kho';
  theTich: string = 'm3';
  dienTich: string = 'm2';
  dsChungLoaiHangHoa: any[] = [];
  dsLoaiHangHoa: any[] = [];
  listTinhTrang: any[] = [];
  listChatLuong: any[] = [];
  listFileDinhKem: any[] = [];
  listLoaiKho: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private khoService: MangLuoiKhoService,
    private modal: NzModalRef,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public globals: Globals
  ) {
    this.formDvi = this.fb.group({
      maDviCha: [''],
      tenDvi: ['', Validators.required],
      maDvi: ['', Validators.required],
      diaChi: [''],
      tenVietTat: [''],
      sdt: [''],
      fax: [''],
      trangThai: ['01'],
      type: ['MLK'],
      ghiChu: [''],
    })
    this.formKho = this.fb.group({
      maCha: [null],
      ngankhoId: [''],
      tongkhoId: [''],
      diaChi: [''],
      tenTongKho: [''],
      tenNganlo: [''],
      maNganlo: [''],
      tenDiemkho: [''],
      maDiemkho: [''],
      diemkhoId: [''],
      tenNhakho: [''],
      maNhakho: [''],
      tenNgankho: [''],
      soNganKhoTk: [''],
      dienTichNganKhoTk: [''],
      maNgankho: [''],
      loaikhoId: [''],
      nhakhoId: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      trangThai: [true],
      type: [true],
      coLoKho: [false],
      ghiChu: [''],
      nhiemVu: [''],
      tichLuongTkLt: [''],
      tichLuongTkVt: [''],
      tichLuongSdLt: [''],
      tichLuongSdVt: [''],
      theTichSdLt: [''],
      theTichSdVt: [''],
      namSudung: [''],
      dienTichDat: [''],
      tichLuongKdLt: [''],
      tichLuongKdVt: [''],
      theTichKdLt: [''],
      theTichKdVt: [''],
      theTichTk: [''],
      theTichTkLt: [''],
      theTichTkVt: [''],
      namNhap: [''],
      tinhtrangId: [''],
      chatluongId: [''],
      slTon: [''],
      ngayNhapDay: [''],
      dviTinh: [''],
      soDiemKho: [''],
      soNhaKho: [''],
      soNganKho: [''],
      soLoKho: [''],
      tenThuKho: [''],
      isKhoiTao: [false],
      loaiHangHoa: [],
      khoiTich: [0]
    })
    this.formKho.controls['maCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      if (node) {
        this.nodeSelected = node.origin
        this.levelNode = node.level + 1
      }
      this.listFileDinhKem = []
      this.setValidators();
      if (this.levelNode != 1) {
        this.formKho.patchValue({
          diaChi: this.nodeSelected ? this.nodeSelected.diaChi : null
        })
      }
    });
  }

  async loadTinhTrangLoKho() {
    this.listTinhTrang = [];
    let res = await this.danhMucService.danhMucChungGetAll('TT_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTinhTrang = res.data;
    }
  }

  async loadChatLuongKho() {
    this.listChatLuong = [];
    let res = await this.danhMucService.danhMucChungGetAll('CL_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listChatLuong = res.data;
    }
  }

  async loadListLoaiKho() {
    this.listLoaiKho = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_KHO');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiKho = res.data;
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDsDvi();
      this.loadTinhTrangLoKho();
      this.loadChatLuongKho();
      this.loadListLoaiKho();
      this.loadDsVthh();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  convertNumberToString(value) {
    return value < 10 ? "0" + value.toString() : value.toString();
  }

  async getDetailMlkByKey(dataNode) {
    if (dataNode) {
      let body = {
        maDvi: dataNode.origin.key,
        capDvi: dataNode.origin.capDvi
      }
      let idMlk;
      await this.khoService.getDetailByMa(body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataNodeRes = res.data.object;
          if (dataNodeRes && dataNodeRes.maNgankho && dataNodeRes.coLoKho == false) {
            this.notification.error(MESSAGE.ERROR, "Không thể thêm lô kho vào ngăn kho này!");
            this.levelNode = 0;
            return;
          }
          idMlk = dataNodeRes.id;
          this.formKho.patchValue({
            tenC: dataNodeRes.tenDiemkho,
            tenDiemkho: dataNodeRes.tenDiemkho,
            tenNhakho: dataNodeRes.tenNhakho,
            tenNgankho: dataNodeRes.tenNgankho,
            tenTongKho: dataNodeRes.tenTongKho,
            diaChi: dataNodeRes.diaChi,
          });
          this.idReq = dataNodeRes.id
        }
      });
      //tự động gen mã kho mới
      let maDvi = dataNode.origin.key
      await this.donviService.getLastMadvi(maDvi).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let charLast = "00";
          let lastDvi = dataNode.origin.key;
          if (res.data) {
            charLast = res.data.slice(-2);
            lastDvi = res.data;
          }
          let valueNext = this.convertNumberToString(parseInt(charLast) + 1);
          let maDviMoi = res.data ? lastDvi.slice(0, -2) + valueNext : lastDvi + valueNext;
          switch (this.levelNode) {
            case 4: {
              this.formKho.patchValue({
                maNganlo: maDviMoi
              })
              break;
            }
            case 3 : {
              this.formKho.patchValue({
                maNgankho: maDviMoi
              })
              break;
            }
            case 2 : {
              this.formKho.patchValue({
                maNhakho: maDviMoi
              })
              break;
            }
            case 1 : {
              this.formKho.patchValue({
                maDiemkho: maDviMoi
              })
              break;
            }
          }
        }
      })
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsLoaiHangHoa = res.data
        if (this.dsLoaiHangHoa && this.dsLoaiHangHoa.length > 0) {
          this.dsLoaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma.startsWith('02') || item.ma.startsWith('03') )
        }
      }
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.dsChungLoaiHangHoa = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.dsChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  listType = ["MLK", "DV"]

  async loadDsDvi() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      type: this.listType
    }
    await this.donviService.layTatCaDviDmKho(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0)
          this.nodesTree = res.data;
        this.nodesTree[0].expanded = false;
      }

    })
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  saveNganLo() {
    this.spinner.show();
    let msg = this.validateLoaiHh();
    if (msg) {
      this.notification.error(MESSAGE.ERROR, msg);
      this.spinner.hide()
      return;
    }
    this.helperService.markFormGroupTouched(this.formKho);
    if (this.formKho.invalid) {
      this.spinner.hide()
      return;
    }
    if (this.idReq != 0) {
      let bodyDvi = this.formDvi.value;
      bodyDvi.maDviCha = this.formKho.value.maCha;
      bodyDvi.tenDvi = this.formKho.value.tenNganlo;
      bodyDvi.maDvi = this.formKho.value.maNganlo;
      bodyDvi.diaChi = this.formKho.value.diaChi;
      let body = this.formKho.value;
      body.loaiHangHoa = this.setLoaiHangHoa();
      body.kieuHang = this.loaiHangHoa.type;
      body.ngankhoId = this.idReq;
      body.maNganlo = this.formKho.value.maNganlo;
      body.fileDinhkems = this.listFileDinhKem;
      body.tichLuongKdLt = body.tichLuongTkLt;
      body.tichLuongKdVt = body.tichLuongTkVt;
      body.theTichKdLt = body.theTichTkLt;
      body.theTichKdVt = body.theTichTkVt;
      body.dviReq = bodyDvi
      body.trangThai = this.formKho.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
      this.khoService.createKho('ngan-lo', body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.modal.close(true)
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
    }
    this.spinner.hide()
  }

  saveNganKho() {
    this.spinner.show()
    let msg = this.validateLoaiHh();
    if (msg && !this.formKho.value.coLoKho) {
      this.notification.error(MESSAGE.ERROR, msg);
      this.spinner.hide()
      return;
    }
    this.helperService.markFormGroupTouched(this.formKho);
    if (this.formKho.invalid) {
      this.spinner.hide()
      return;
    }
    if (this.idReq != 0) {
      let bodyDvi = this.formDvi.value;
      bodyDvi.maDviCha = this.formKho.value.maCha;
      bodyDvi.tenDvi = this.formKho.value.tenNgankho;
      bodyDvi.maDvi = this.formKho.value.maNgankho;
      bodyDvi.diaChi = this.formKho.value.diaChi;
      let body = this.formKho.value;
      body.dviReq = bodyDvi
      body.loaiHangHoa = this.setLoaiHangHoa();
      body.kieuHang = this.loaiHangHoa.type;
      body.maNgankho = this.formKho.value.maNgankho;
      body.tichLuongKdLt = body.tichLuongTkLt;
      body.tichLuongKdVt = body.tichLuongTkVt;
      body.theTichKdLt = body.theTichTkLt;
      body.theTichKdVt = body.theTichTkVt;
      body.nhakhoId = this.idReq;
      body.trangThai = this.formKho.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
      body.isKhoiTao = this.formKho.get('coLoKho').value ? false : true;
      body.fileDinhkems = this.listFileDinhKem;
      this.khoService.createKho('ngan-kho', body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.modal.close(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
    }
    this.spinner.hide()
  }

  saveNhaKho() {
    this.spinner.show()
    this.helperService.markFormGroupTouched(this.formKho);
    if (this.formKho.invalid) {
      this.spinner.hide()
      return;
    }
    if (this.idReq) {
      let bodyDvi = this.formDvi.value;
      bodyDvi.maDviCha = this.formKho.value.maCha;
      bodyDvi.tenDvi = this.formKho.value.tenNhakho;
      bodyDvi.maDvi = this.formKho.value.maNhakho;
      bodyDvi.diaChi = this.formKho.value.diaChi;
      let body = this.formKho.value;
      body.dviReq = bodyDvi
      body.maNhakho = this.formKho.value.maNhakho;
      body.diemkhoId = this.idReq;
      body.trangThai = this.formKho.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
      body.fileDinhkems = this.listFileDinhKem;
      this.khoService.createKho('nha-kho', body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.modal.close(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
    }
    this.spinner.hide()
  }

  saveDiemKho() {
    this.spinner.show()
    this.helperService.markFormGroupTouched(this.formKho);
    if (this.formKho.invalid) {
      this.spinner.hide();
      return;
    }
    if (this.idReq) {
      let bodyDvi = this.formDvi.value;
      bodyDvi.maDviCha = this.formKho.value.maCha;
      bodyDvi.tenDvi = this.formKho.value.tenDiemkho;
      bodyDvi.maDvi = this.formKho.value.maDiemkho;
      bodyDvi.diaChi = this.formKho.value.diaChi;
      let body = this.formKho.value;
      body.dviReq = bodyDvi;
      body.tongkhoId = this.idReq;
      body.trangThai = this.formKho.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
      body.maDiemkho = this.formKho.value.maDiemkho;
      body.fileDinhkems = this.listFileDinhKem;
      this.khoService.createKho('diem-kho', body).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.modal.close(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
    } else {

    }
    this.spinner.hide();
  }

  saveKho(level?) {
    switch (level) {
      case 4: {
        this.saveNganLo();
        break;
      }
      case 3 : {
        this.saveNganKho();
        break;
      }
      case 2 : {
        this.saveNhaKho();
        break;
      }
      case 1 : {
        this.saveDiemKho();
        break;
      }
    }
  }

  setValidators() {
    this.helperService.removeValidators(this.formKho);
    switch (this.levelNode) {
      case 1 : {
        this.formKho.controls['maDiemkho'].setValidators([Validators.required])
        this.formKho.controls['tenDiemkho'].setValidators([Validators.required])
        this.formKho.controls['diaChi'].setValidators([Validators.required])
        break;
      }
      case 2 : {
        this.formKho.controls['maNhakho'].setValidators([Validators.required])
        this.formKho.controls['tenNhakho'].setValidators([Validators.required])
        this.formKho.controls['loaikhoId'].setValidators([Validators.required])
        this.formKho.controls['tinhtrangId'].setValidators([Validators.required])
        this.formKho.controls['chatluongId'].setValidators([Validators.required])
        break;
      }
      case 3 : {
        this.formKho.controls['maNgankho'].setValidators([Validators.required])
        this.formKho.controls['tenNgankho'].setValidators([Validators.required])
        this.formKho.controls['tinhtrangId'].setValidators([Validators.required])
        this.formKho.controls['coLoKho'].setValidators([Validators.required])
        break;
      }
      case 4 : {
        this.formKho.controls['maNganlo'].setValidators([Validators.required])
        this.formKho.controls['tenNganlo'].setValidators([Validators.required])
        this.formKho.controls['tinhtrangId'].setValidators([Validators.required])
        this.formKho.controls['tichLuongTkLt'].setValidators([Validators.required])
        this.formKho.controls['tichLuongTkVt'].setValidators([Validators.required])
        this.formKho.controls['theTichTkLt'].setValidators([Validators.required])
        this.formKho.controls['theTichTkVt'].setValidators([Validators.required])
        break;
      }
    }
  }

  setLoaiHangHoa(): string {
    let arr = [];
    if (this.loaiHangHoa.type == 'LT') {
      if (this.loaiHangHoa.gao) {
        arr.push("0102")
      }
      if (this.loaiHangHoa.thoc) {
        arr.push("0101")
      }
      if (this.loaiHangHoa.muoi) {
        arr.push("04")
      }
    } else {
      if (this.loaiHangHoa.loaiVthh) {
        arr.push(this.loaiHangHoa.loaiVthh)
      }
      if (this.loaiHangHoa.cloaiVthh) {
        arr.push(this.loaiHangHoa.cloaiVthh)
      }
    }
    let string = ''
    if (arr && arr.length > 0) {
      string = arr.toString()
    }
    return string;
  }

  validateLoaiHh() : string {
    let msg;
    if (!this.loaiHangHoa.type) {
      msg = 'Vui lòng chọn loại hàng hóa ngăn/lô kho có thể chứa'
    } else if (this.loaiHangHoa.type == 'LT') {
      if (!this.loaiHangHoa.thoc && !this.loaiHangHoa.gao && !this.loaiHangHoa.muoi) {
        msg = 'Vui lòng chọn loại hàng hóa ngăn/lô kho có thể chứa'
      }
    } else if (this.loaiHangHoa.type == 'VT') {
      if (!this.loaiHangHoa.loaiVthh) {
        msg = 'Vui lòng chọn loại hàng hóa ngăn/lô kho có thể chứa'
      }
    }
    return msg;
  }
}
