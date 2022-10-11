import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuQDPheDuyetKHLCNTComponent } from 'src/app/components/dialog/dialog-can-cu-qd-phe-duyet-khlcnt/dialog-can-cu-qd-phe-duyet-khlcnt.component';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DATEPICKER_CONFIG } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { dauThauGoiThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/dauThauGoiThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { DieuChinhQuyetDinhPdKhlcntService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";

@Component({
  selector: 'app-themmoi-dieuchinh',
  templateUrl: './themmoi-dieuchinh.component.html',
  styleUrls: ['./themmoi-dieuchinh.component.scss']
})
export class ThemMoiDieuChinhComponent implements OnInit {
  @Input() isViewDetail: boolean;
  @Input() typeHangHoa: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  danhsachDx: any[] = [];
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private dieuChinhQuyetDinhPdKhlcntService: DieuChinhQuyetDinhPdKhlcntService,
    public globals: Globals,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private dauThauGoiThauService: dauThauGoiThauService,
    private modal: NzModalService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get('year'), Validators.required],
      soQd: ['', [Validators.required]],
      idQdGoc: ['', Validators.required],
      soQdGoc: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      ngayHluc: ['', [Validators.required]],
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
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      tchuanCluong: [''],
      ldoTuchoi: [''],
    });
  }
  maQd: string = '';
  isVatTu: boolean = false;
  listNam: any[] = [];
  listQdGoc: any[] = [];
  listNthauNopHs: any[] = [];
  listDiaDiemNhapHang: any[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  editDiaDiemCache: { [key: string]: { edit: boolean; data: any } } = {};
  i = 0;
  listNguonVon: any[] = []
  listPhuongThucDauThau: any[] = []
  listHinhThucDauThau: any[] = []
  listLoaiHopDong: any[] = []
  listVthh: any[] = [];
  formData: FormGroup
  isDetail = false;
  dataTable: any[] = [];
  dataDetail: any;
  errorInputRequired: string = 'Dữ liệu không được để trống.';

  STATUS = STATUS;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.maQd = "/" + this.userInfo.MA_QD
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await Promise.all([
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.getDetail(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
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
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai()
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

  async getDetail() {
    if (this.idInput > 0) {
      let res = await this.dieuChinhQuyetDinhPdKhlcntService.getDetail(this.idInput);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.isVatTu = data.loaiVthh.startsWith("02");
        this.formData.patchValue({
          id: data.id,
          soQd: data.soQd.split("/")[0],
          ngayQd: data.ngayQd,
          ngayHluc: data.ngayHluc,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          tgianBdauTchuc: data.tgianBdauTchuc,
          tgianDthau: data.tgianDthau,
          tgianMthau: data.tgianMthau,
          tgianNhang: data.tgianNhang,
          namKhoach: data.namKhoach,
          ghiChu: data.ghiChu,
          trangThai: data.trangThai,
          tenTrangThai: data.tenTrangThai,
          trichYeu: data.trichYeu,
          idQdGoc: data.idQdGoc,
          soQdGoc: data.soQdGoc,
          ldoTuchoi: data.ldoTuchoi,
        });
        if (this.isVatTu) {
          this.danhsachDx = data.hhQdKhlcntDtlList[0].dsGoiThau
        } else {
          this.danhsachDx = data.hhQdKhlcntDtlList
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.setTitle();
  }

  openDialogQDPDKHLCNT() {
    // if (this.id == 0) {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin căn cứ quyết định phê duyệt KHLCNT',
      nzContent: DialogCanCuQDPheDuyetKHLCNTComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.formData.patchValue({
          canCu: data.soQd ?? null,
          loaiVthh: data.loaiVthh ?? null,
          tenLoaiVthh: data.tenLoaiVthh ?? null,
          cLoaiVthh: data.cloaiVthh ?? null,
          tenCloaiVthh: data.tenCloaiVthh ?? null,
          moTaHangHoa: data.moTaHangHoa ?? null,
          loaiHdong: data.loaiHdong ?? null,
          hthucLcnt: data.hthucLcnt ?? null,
          pthucLcnt: data.pthucLcnt ?? null,
          nguonVon: data.nguonVon ?? null,
          tgianDthau: data.tgianDthau ?? null,
          tgianMthau: data.tgianMthau ?? null,
          tgianNhang: data.tgianNhang ?? null,
        })
      }
    });
    // }
  }

  redirectToChiTiet(data) {
    console.log(data);
    this.isDetail = true;
    this.formData.patchValue({
      idGoiThau: data.id,
      tenGoiThau: data.tenDuAn,
      tenDvi: data.tenDvi,
      maDvi: data.maDvi,
      donGia: data.donGia,
      soLuong: data.soLuong,
      tongTien: data.tongTien,
    });
    this.listNthauNopHs = [{
      ten: '',
      soThue: '',
      diaChi: '',
      soDt: ''
    }]
    this.listDiaDiemNhapHang = [{
      maDvi: '',
      maDiemKho: '',
      maKho: '',
    }]
    this.updateEditCache();
  }

  quayLai() {
    this.showListEvent.emit();
  }

  selectHangHoa() {
    const modal = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        isCaseSpecial: true
      },
    });
    modal.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.formData.patchValue({
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
        loaiVthh: data.parent.ma,
        tenLoaiVthh: data.parent.ten
      })
      this.isVatTu = false;
    }
    if (data.loaiHang == "VT") {
      this.formData.patchValue({
        loaiVthh: data.ma,
        tenLoaiVthh: data.ten,
        cloaiVthh: null,
        tenCloaiVthh: null,
      })
      this.isVatTu = true;
    }
    this.getQdGocList();
  }

  async getQdGocList() {
    this.spinner.show();
    this.listQdGoc = [];
    console.log(this.formData)
    let body = {
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.formData.get('loaiVthh') ? this.formData.get('loaiVthh').value : null,
      cloaiVthh: this.formData.get('cloaiVthh') ? this.formData.get('cloaiVthh').value : null,
      namKhoach: this.formData.get('namKhoach') ? this.formData.get('namKhoach').value : null,
      lastest: 1
    }
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listQdGoc = res.data.content

    }
    this.spinner.hide();
  }

  async onChangeSoQdGoc($event) {
    this.spinner.show();
    if ($event) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail($event);
      let qdGoc = this.listQdGoc.filter(item => item.id == $event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (this.isVatTu) {
          this.danhsachDx = data.hhQdKhlcntDtlList[0].dsGoiThau
          this.formData.patchValue({
            ngayQd: data.ngayQd,
            ngayHluc: data.ngayHluc,
            ghiChu: data.ghiChu,
            trichYeu: data.trichYeu,
            idQdGoc: $event,
            soQdGoc: qdGoc.length > 0 ? qdGoc[0].soQd : null
          })
        } else {
          this.danhsachDx = data.hhQdKhlcntDtlList
          this.formData.patchValue({
            ngayQd: data.ngayQd,
            ngayHluc: data.ngayHluc,
            ghiChu: data.ghiChu,
            trichYeu: data.trichYeu,
            idQdGoc: $event,
            soQdGoc: qdGoc.length > 0 ? qdGoc[0].soQd : null,
            hthucLcnt: data.hthucLcnt,
            pthucLcnt: data.pthucLcnt,
            loaiHdong: data.loaiHdong,
            nguonVon: data.nguonVon,
            tgianBdauTchuc: data.tgianBdauTchuc,
            tgianDthau: data.tgianDthau,
            tgianMthau: data.tgianMthau,
            tgianNhang: data.tgianNhang,
            tgianThienHd: data.tgianThienHd
          })
        }
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  themMoiGoiThau() {
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  addRow(): void {
    this.listNthauNopHs = [
      ...this.listNthauNopHs,
      {}
    ];
    this.i++;
    this.listNthauNopHs.forEach((value, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...value }
      };
    })
    this.editCache[this.i].edit = true;
  }

  updateEditCache(): void {
    this.listNthauNopHs.forEach((item, index) => {
      this.editCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
    this.listDiaDiemNhapHang.forEach((item, index) => {
      this.editDiaDiemCache[index] = {
        edit: true,
        data: { ...item }
      };
    });
  }

  startEdit(index: number): void {
    console.log(index);
    this.editCache[index].edit = true;
  }

  deleteRow(index: number) {
    this.listNthauNopHs = this.listNthauNopHs.filter((d, index) => index !== index);
  }

  cancelEdit(id: any): void {
    const index = this.listNthauNopHs.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listNthauNopHs[index] },
      edit: false
    };
  }

  saveEdit(index: any): void {
    Object.assign(
      this.listNthauNopHs[index],
      this.editCache[index].data,
    );
    this.editCache[index].edit = false;
  }

  async saveDthauGthau() {
    let body = this.formData.value;
    console.log(body)
    body.children = this.listNthauNopHs;
    let res = await this.dauThauGoiThauService.create(body);
    console.log(res);
  }

  calendarGia() {
    let donGia = this.formData.get('donGia').value;
    let VAT = this.formData.get('VAT').value;
    let soLuong = this.formData.get('soLuong').value;
    if (donGia >= 0 && VAT >= 0) {
      this.formData.patchValue({
        dgianHdongSauThue: (donGia + (donGia * VAT / 100)),
        giaHdongTruocThue: donGia * soLuong,
        giaHdongSauThue: (donGia + (donGia * VAT / 100)) * soLuong,
      })
    }
  }
  iconButtonDuyet: string;
  titleButtonDuyet: string;
  titleStatus: string;
  setTitle() {
    let trangThai = this.formData.get('trangThai').value
    switch (trangThai) {
      case STATUS.DU_THAO: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        this.titleStatus = 'Dự thảo';
        break;
      }
      case STATUS.TU_CHOI_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_guiduyet'
        this.titleButtonDuyet = 'Gửi duyệt';
        this.titleStatus = 'Từ chối - LĐ Vụ';
        break;
      }
      case STATUS.CHO_DUYET_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Duyệt';
        this.titleStatus = 'Chờ duyệt - LĐ Vụ';
        break
      }
      case STATUS.DA_DUYET_LDV: {
        this.iconButtonDuyet = 'htvbdh_tcdt_pheduyet'
        this.titleButtonDuyet = 'Ban hành';
        this.titleStatus = 'Đã duyệt';
        break
      }
      case STATUS.BAN_HANH: {
        this.titleStatus = 'Ban hành';
        break
      }
    }

  }

  openDialogGoiThau(data?: any, index?: number, isReadOnly?: boolean) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: data ? data.loaiVthh : this.formData.get('loaiVthh').value,
        isReadOnly: isReadOnly
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        console.log(res);
        console.log(index);
        // res.nguonVon = this.dataNguonVon.nguonVon;
        // res.tenNguonVon = this.dataNguonVon.tenNguonVon;
        // if (index >= 0) {
        //   this.danhsachDx[index] = res;
        // } else {
        //   this.danhsachDx.push(res);
        // }
        // console.log(this.danhsachDx)
      }
    });
  }

  deleteSelect() {

  }

  deleteItem(index) {
    this.danhsachDx = this.danhsachDx.filter((item, i) => i !== index)
  }

  async openDialogDeXuat(index) {
    let data = this.danhsachDx[index]
    this.modal.create({
      nzTitle: '',
      nzContent: DialogThongTinPhuLucQuyetDinhPheDuyetComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        isEdit: true
      },
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData);
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + this.maQd;
    body.dsDeXuat = this.danhsachDx;
    body.dsGoiThau = this.danhsachDx;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.update(body);
    } else {
      res = await this.dieuChinhQuyetDinhPdKhlcntService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.quayLai()
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.quayLai()
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async guiDuyet() {
    let trangThai = ''
    let mesg = ''
    if (this.formData.get('loaiVthh').value.startsWith("02")) {
      switch (this.formData.get('trangThai').value) {
        case STATUS.DU_THAO: {
          trangThai = STATUS.CHO_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.TU_CHOI_LDV: {
          trangThai = STATUS.CHO_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.CHO_DUYET_LDV: {
          trangThai = STATUS.DA_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.DA_DUYET_LDV: {
          trangThai = STATUS.BAN_HANH;
          mesg = 'Văn bản sẵn sàng ban hành ?'
          break;
        }
      }
    } else {
      trangThai = STATUS.BAN_HANH;
      mesg = 'Văn bản sẵn sàng ban hành ?'
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
        this.spinner.show();
        try {
          let body = {
            "id": this.idInput,
            "trangThai": trangThai
          }
          let res = await this.dieuChinhQuyetDinhPdKhlcntService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.THAO_TAC_SUCCESS);
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

  setValidator() {
    if (this.formData.get('loaiVthh').value.startsWith('02')) {
      this.formData.controls["hthucLcnt"].clearValidators();
      this.formData.controls["pthucLcnt"].clearValidators();
      this.formData.controls["loaiHdong"].clearValidators();
      this.formData.controls["nguonVon"].clearValidators();
      this.formData.controls["tgianBdauTchuc"].clearValidators();
      this.formData.controls["tgianDthau"].clearValidators();
      this.formData.controls["tgianMthau"].clearValidators();
      this.formData.controls["tgianNhang"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();

    } else {
      this.formData.controls["hthucLcnt"].setValidators([Validators.required]);
      this.formData.controls["pthucLcnt"].setValidators([Validators.required]);
      this.formData.controls["loaiHdong"].setValidators([Validators.required]);
      this.formData.controls["nguonVon"].setValidators([Validators.required]);
      this.formData.controls["tgianBdauTchuc"].setValidators([Validators.required]);
      this.formData.controls["tgianDthau"].setValidators([Validators.required]);
      this.formData.controls["tgianMthau"].setValidators([Validators.required]);
      this.formData.controls["tgianNhang"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
    }
  }

  openDialogSoQdGoc() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định gốc',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listQdGoc,
        dataHeader: ['Số quyết định gốc', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.onChangeSoQdGoc(data.id);
      }
    });

  }

}
