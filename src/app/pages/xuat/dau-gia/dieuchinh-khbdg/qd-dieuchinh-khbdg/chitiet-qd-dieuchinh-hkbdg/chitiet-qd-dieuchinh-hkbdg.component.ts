import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { cloneDeep } from "lodash";
import {
  DialogThemMoiGoiThauComponent
} from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { STATUS } from 'src/app/constants/status';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { PAGE_SIZE_DEFAULT } from "../../../../../../constants/config";
import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';

@Component({
  selector: 'app-chitiet-qd-dieuchinh-hkbdg',
  templateUrl: './chitiet-qd-dieuchinh-hkbdg.component.html',
  styleUrls: ['./chitiet-qd-dieuchinh-hkbdg.component.scss']
})
export class ChitietQdDieuchinhHkbdgComponent implements OnInit {
  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  @ViewChild('bodyChiTiet')
  bodyChiTiet: ElementRef;
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
  listVatTuHangHoa: any[] = [];
  fileList: any[] = [];
  listDanhSachTongHop: any[] = [];
  listToTrinh: any[] = [];
  urlUploadFile: string = `${environment.SERVICE_API}/qlnv-core/file/upload-attachment`;
  lastBreadcrumb: string;
  userInfo: UserLogin;
  danhMucDonVi: any;
  danhsachDx: any[] = [];
  danhsachDxCache: any[] = [];
  iconButtonDuyet: string;
  titleButtonDuyet: string;
  listNam: any[] = [];
  yearNow: number = 0;
  listOfData: any[] = [];
  STATUS = STATUS
  dataInput: any;
  dataInputCache: any;
  isTongHop: boolean
  dsQdPd: any[];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  flagInit = false

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    public globals: Globals,
    public uploadFileService: UploadFileService
  ) {

    this.formData = this.fb.group({
      id: [null],
      namKh: [dayjs().get('year'), Validators.required],
      soQdPd: ['',],
      soQdDc: ['',],
      ngayKyQd: ['',],
      ngayHluc: ['',],
      idThHdr: [''],
      soTrHdr: [''],
      idTrHdr: [''],
      trichYeu: [''],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      tchuanCluong: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [''],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tgianGnhan: [''],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBaoKh: [''],
      soQdCc: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự thảo'],
      soDviTsan: [''],
      slHdDaKy: [''],
      ldoTuchoi: [''],
      phanLoai: ['', [Validators.required]],
      fileName: []
    })
  }

  setValidator(isGuiDuyet?) {
    if (isGuiDuyet) {
      this.formData.controls["soQdPd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyQd"].setValidators([Validators.required]);
      this.formData.controls["ngayHluc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soQdPd"].clearValidators();
      this.formData.controls["ngayKyQd"].clearValidators();
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

  isDetailPermission() {
    if (this.userService.isAccessPermisson("XHDTQG_PTDG_DCKHBDG_THEM")) {
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
      await Promise.all([
        this.loadDsQdPd()
      ]);
      if (this.idInput) {
        await this.loadChiTiet(this.idInput);
      } else {
        this.initForm();
      }
      await Promise.all([
        // this.bindingDataTongHop(this.dataTongHop),
      ]);
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    this.flagInit = true
    await this.spinner.hide();
  }

  initForm() {
    this.formData.patchValue({
      namKh: dayjs().get('year'),
      phanLoai: this.loaiVthh == '02' ? 'TTr' : 'TH'
    })
  }

  async bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKh: +dataTongHop.namKh,
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
        phanLoai: 'TH',
      })
      await this.selectMaTongHop(dataTongHop.id);
    }
    await this.listDsTongHopToTrinh();
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  async listDsTongHopToTrinh() {
    await this.spinner.show();
    // Get data tổng hợp
    let bodyTh = {
      trangThai: STATUS.CHUA_TAO_QD,
      namKh: this.formData.get('namKh').value,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resTh = await this.tongHopDeXuatKeHoachBanDauGiaService.search(bodyTh);
    if (resTh.msg == MESSAGE.SUCCESS) {
      this.listDanhSachTongHop = resTh.data.content;
    }
  }

  async save(isGuiDuyet?) {
    try {
      await this.spinner.show();
      if (!this.isDetailPermission()) {
        console.log('khong co quyen')
        return;
      }
      this.setValidator(isGuiDuyet)
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      if (this.formData.value.soQdDc) {
        body.soQdDc = this.formData.value.soQdDc + "/" + this.maQd;
      }
      body.dsDeXuat = this.danhsachDx;
      body.fileDinhKems = this.fileDinhKem;
      let res = null;
      if (this.formData.get('id').value) {
        res = await this.quyetDinhDchinhKhBdgService.update(body);
      } else {
        res = await this.quyetDinhDchinhKhBdgService.create(body);
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
    } catch (e) {
    } finally {
      await this.spinner.hide();
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
        await this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: text,
            trangThai: STATUS.TU_CHOI_LDV,
          };
          const res = await this.quyetDinhDchinhKhBdgService.approve(body);
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
    if (this.formData.get('loaiVthh').value.startsWith('02')) {
      switch (this.formData.get('trangThai').value) {
        case STATUS.DU_THAO: {
          trangThai = STATUS.CHO_DUYET_LDV;
          mesg = 'Bạn có muốn gửi duyệt ?'
          break;
        }
        case STATUS.CHO_DUYET_LDV: {
          trangThai = STATUS.DA_DUYET_LDV;
          mesg = 'Văn bản sẵn sàng duyệt ?'
          break;
        }
        case STATUS.DA_DUYET_LDV: {
          trangThai = STATUS.BAN_HANH;
          mesg = 'Văn bản sẵn sàng ban hành ?'
          break;
        }
      }
    } else {
      switch (this.formData.get('trangThai').value) {
        case STATUS.DU_THAO: {
          trangThai = STATUS.BAN_HANH;
          mesg = 'Văn bản sẵn sàng ban hành ?'
          break;
        }
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
          let res = await this.quyetDinhDchinhKhBdgService.approve(body);
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

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhDchinhKhBdgService.getDetail(id);
      this.listToTrinh = [];
      this.listDanhSachTongHop = [];
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQdDc: data.soQdDc?.split("/")[0],
        soQdPd: +data.soQdPd,
      });
      if (data.loaiVthh.startsWith("02")) {
        this.danhsachDx = data.children;
      } else {
        this.danhsachDx = data.children;
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        for (const item of this.danhsachDxCache) {
          await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.dsPhanLoList = res.data.dsPhanLoList;
            }
          })
        }
      }
    }
    ;
  }

  openDialogTh() {
    if (this.formData.get('phanLoai').value != 'TH') {
      return;
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách tổng hợp đề xuất kế hoạch bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDanhSachTongHop,
        dataHeader: ['Số tổng hợp', 'Nội dung tổng hợp'],
        dataColumn: ['id', 'noiDungThop']

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
      const res = await this.tongHopDeXuatKeHoachBanDauGiaService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          soQdCc: data.soQdPd,
          idThHdr: event,
          idTrHdr: null,
          soTrHdr: null,
        })
        this.danhsachDx = data.thopDxKhBdgDtlList;
        for (const item of this.danhsachDx) {
          await this.deXuatKhBanDauGiaService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.dsPhanLoList = res.data.dsPhanLoList;
            }
          })
        }
        ;
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
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: this.loaiVthh == '02' ? STATUS.DA_DUYET_LDV : STATUS.DA_DUYET_LDC,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.get('namKh').value,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.deXuatKhBanDauGiaService.search(bodyToTrinh);
    if (resToTrinh.msg == MESSAGE.SUCCESS) {
      this.listToTrinh = resToTrinh.data.content;
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
        dataTable: this.listToTrinh,
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
      const res = await this.deXuatKhBanDauGiaService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        let tongMucDt = 0
        if (dataRes.loaiVthh.startsWith("02")) {
          this.danhsachDx = dataRes.dsPhanLoList;
          this.danhsachDx.forEach(element => {
            tongMucDt += element.soLuong * element.donGiaVat;
          });
        } else {
          dataRes.idDxHdr = data.id;
          this.danhsachDx.push(dataRes);
        }
        this.formData.patchValue({
          cloaiVthh: data.cloaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          loaiVthh: data.loaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tchuanCluong: data.tchuanCluong,
          moTaHangHoa: data.moTaHangHoa,
          tgianDkienTu: data.tgianDkienTu,
          tgianDkienDen: data.tgianDkienDen,
          tgianTtoan: data.tgianTtoan,
          tgianTtoanGhiChu: data.tgianTtoanGhiChu,
          pthucTtoan: data.pthucTtoan,
          tgianGnhan: data.tgianGnhan,
          tgianGnhanGhiChu: data.tgianGnhanGhiChu,
          pthucGnhan: data.pthucGnhan,
          thongBaoKh: data.thongBaoKh,
          soQdCc: data.soQdCtieu,
          trichYeu: dataRes.trichYeu,
          tenDvi: data.tenDvi,
          maDvi: data.maDvi,
          idThHdr: null,
          soTrHdr: dataRes.soDxuat,
          idTrHdr: dataRes.id,
          tongMucDt: tongMucDt
        })
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        this.dataInput = null;
        this.dataInputCache = null;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    await this.spinner.hide();
  }

  index = 0;

  async showDetail($event, index) {
    await this.spinner.show();
    console.log(this.bodyChiTiet.nativeElement)
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.isTongHop = this.formData.value.phanLoai == 'TH';
    this.dataInput = this.danhsachDx[index];
    this.dataInputCache = this.danhsachDxCache[index];
    this.index = index;
    await this.spinner.hide();
  }

  setNewSoLuong($event) {
    this.danhsachDx[this.index].soLuong = $event;
  }

  setDataTaiSan($event) {
    if ($event) {
      if ($event.tgianBdauTchuc) {
        this.danhsachDx[this.index].tgianDkienTu = dayjs($event.tgianBdauTchuc[0]).format('YYYY-MM-DD');
        this.danhsachDx[this.index].tgianDkienDen = dayjs($event.tgianBdauTchuc[1]).format('YYYY-MM-DD');
      }
      if ($event.dsPhanLoList) {
        this.danhsachDx[this.index].children = $event.dsPhanLoList;
      }

    }
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
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: this.formData.get('loaiVthh').value,
        dviTinh: this.formData.get('loaiVthh').value.maDviTinh,
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
          tongMucDt = tongMucDt + item.soLuong * item.donGia;
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt,
        });
      }
    });
  }

  deleteRow(index) {
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

  getNameFileQD($event: any) {
    if ($event.target.files) {
      const itemFile = {
        name: $event.target.files[0].name,
        file: $event.target.files[0] as File,
      };
      this.uploadFileService
        .uploadFile(itemFile.file, itemFile.name)
        .then((resUpload) => {
          let fileDinhKemQd = new FileDinhKem();
          fileDinhKemQd.fileName = resUpload.filename;
          fileDinhKemQd.fileSize = resUpload.size;
          fileDinhKemQd.fileUrl = resUpload.url;
          fileDinhKemQd.idVirtual = new Date().getTime();
          this.formData.patchValue({ fileDinhKem: fileDinhKemQd, fileName: itemFile.name })
        });
    }
  }

  async loadDsQdPd() {
    this.quyetDinhPdKhBdgService.search({
      trangThai: STATUS.BAN_HANH,
      namKh: this.formData.get('namKh').value,
      lastest: 0,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: this.page - 1,
      },
    }).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dsQdPd = data.content;
        }
      } else {
        this.dsQdPd = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    });
  }

  changeQdPd(id) {
    if (id && this.flagInit) {
      this.spinner.show();
      this.quyetDinhPdKhBdgService.getDetail(id).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            /*   res.data = {
                 "id": 622,
                 "namKh": 2022,
                 "maDvi": "0101",
                 "tenDvi": "Tổng cục Dự trữ Nhà nước",
                 "soQdPd": "312/QĐ-TCDT",
                 "ngayKyQd": "2022-12-19",
                 "ngayHluc": "2022-12-19",
                 "idThHdr": null,
                 "soTrHdr": "111/TTr-CDTVP",
                 "idTrHdr": 1262,
                 "trichYeu": "Test 5",
                 "loaiVthh": "0101",
                 "tenLoaiVthh": "Thóc tẻ",
                 "cloaiVthh": "010101",
                 "tenCloaiVthh": "Hạt rất dài",
                 "moTaHangHoa": "111",
                 "soQdCc": "150/TCDT",
                 "tchuanCluong": "Thông tư 87/2020/TT-BTC",
                 "tgianDkienTu": "2022-12-01",
                 "tgianDkienDen": "2023-02-07",
                 "tgianTtoan": 111,
                 "tgianTtoanGhiChu": "11",
                 "pthucTtoan": "1",
                 "tgianGnhan": 11,
                 "tgianGnhanGhiChu": "111",
                 "pthucGnhan": "11",
                 "thongBaoKh": "11",
                 "khoanTienDatTruoc": null,
                 "tongSoLuong": null,
                 "tongTienKdienDonGia": null,
                 "tongTienDatTruocDonGia": null,
                 "trangThai": "29",
                 "tenTrangThai": "Ban Hành",
                 "ngayTao": "2022-12-19",
                 "nguoiTao": "admin",
                 "ngaySua": "2022-12-19",
                 "nguoiSua": "admin",
                 "ngayGuiDuyet": null,
                 "nguoiGuiDuyet": null,
                 "soDviTsan": null,
                 "slHdDaKy": null,
                 "soQdPdKqBdg": null,
                 "ldoTuchoi": null,
                 "ngayPduyet": "19/12/2022 17:09:00",
                 "nguoiPduyet": "admin",
                 "lastest": false,
                 "phanLoai": "TTr",
                 "idGoc": null,
                 "soDxuatKhBdg": null,
                 "children": [
                   {
                     "id": 566,
                     "idQdHdr": 622,
                     "idDxHdr": 1262,
                     "maDvi": "010102",
                     "tenDvi": "Cục DTNNKV Vĩnh Phú",
                     "soDxuat": "111/TTr-CDTVP",
                     "ngayTao": "2022-12-19",
                     "ngayPduyet": "2022-12-19",
                     "tgianDkienTu": "2022-12-01",
                     "tgianDkienDen": "2023-02-07",
                     "trichYeu": "Test ",
                     "tongSoLuong": 0.011,
                     "soDviTsan": null,
                     "tongTienKdienDonGia": 0,
                     "tongTienDatTruocDonGia": 0,
                     "moTaHangHoa": "111",
                     "diaChi": "Số 7 đường Trần Phú - phường Gia Cẩm - thành phố Việt Trì - tỉnh Phú Thọ",
                     "soQdPdKqBdg": null,
                     "trangThai": "33",
                     "tenTrangThai": "Chưa cập nhật",
                     "tgianTtoan": 111,
                     "tgianTtoanGhiChu": "11",
                     "pthucTtoan": "1",
                     "tgianGnhan": 11,
                     "tgianGnhanGhiChu": "111",
                     "pthucGnhan": "11",
                     "thongBaoKh": "11",
                     "khoanTienDatTruoc": 11,
                     "xhQdPdKhBdg": null,
                     "xhDxKhBanDauGia": null,
                     "children": [
                       {
                         "id": 606,
                         "idQdDtl": 566,
                         "maDvi": "01010201",
                         "tenDvi": "Chi cục Dự trữ Nhà nước Việt Trì",
                         "maDiemKho": "0101020101",
                         "diaDiemKho": null,
                         "tenDiemKho": "Điểm kho Phủ Đức",
                         "maNhaKho": "010102010101",
                         "tenNhakho": "Nhà kho A1",
                         "maNganKho": "01010201010101",
                         "tenNganKho": "Ngăn kho A1/1",
                         "maLoKho": "0101020101010102",
                         "tenLoKho": "Lô số 1 Ngăn kho A1/1",
                         "loaiVthh": null,
                         "tenLoaiVthh": null,
                         "cloaiVthh": "010102",
                         "tenCloaiVthh": "Hạt dài",
                         "maDviTsan": "11",
                         "duDau": 500000,
                         "soLuong": 11,
                         "giaKhongVat": 111,
                         "giaKhoiDiem": 1221,
                         "donGiaVat": null,
                         "giaKhoiDiemDduyet": 0,
                         "tienDatTruoc": 134.31,
                         "tienDatTruocDduyet": 0,
                         "soLuongChiTieu": 1000,
                         "soLuongKh": null,
                         "tongSoLuong": 11,
                         "tongTienDatTruoc": 134.31,
                         "tongTienDatTruocDd": 0,
                         "dviTinh": null,
                         "trangThai": "33",
                         "tenTrangThai": "Chưa cập nhật",
                         "xhQdPdKhBdgDtl": null,
                         "xhQdPdKhBdg": null,
                         "children": [
                           {
                             "id": 526,
                             "idPhanLo": 606,
                             "maDvi": "01010201",
                             "tenDvi": "Chi cục Dự trữ Nhà nước Việt Trì",
                             "maDiemKho": "0101020101",
                             "tenDiemKho": "Điểm kho Phủ Đức",
                             "maNhaKho": "010102010101",
                             "tenNhakho": "Nhà kho A1",
                             "maNganKho": "01010201010101",
                             "tenNganKho": "Ngăn kho A1/1",
                             "maLoKho": "0101020101010102",
                             "tenLoKho": "Lô số 1 Ngăn kho A1/1",
                             "loaiVthh": null,
                             "tenLoaiVthh": null,
                             "cloaiVthh": "010102",
                             "tenCloaiVthh": "Hạt dài",
                             "maDviTsan": "11",
                             "duDau": 500000,
                             "soLuong": 11,
                             "giaKhongVat": 111,
                             "giaKhoiDiem": 1221,
                             "donGiaVat": null,
                             "giaKhoiDiemDduyet": 0,
                             "tienDatTruoc": 134.31,
                             "tienDatTruocDduyet": 0,
                             "soLuongChiTieu": null,
                             "soLuongKh": null,
                             "dviTinh": null,
                             "tongSoLuong": 11,
                             "tongTienDatTruoc": 134.31,
                             "tongTienDatTruocDd": 0,
                             "idQdHdr": 622
                           }
                         ]
                       }
                     ]
                   }
                 ],
                 "fileDinhKems": [],
                 "canCuPhapLy": []
               };*/
            delete res.data?.trangThai;
            delete res.data?.tenTrangThai;
            delete res.data?.id;
            delete res.data?.soQdPd;
            this.formData.patchValue(res.data);
            this.danhsachDx = this.danhsachDxCache = res.data?.children;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
      })
    }
  }


}