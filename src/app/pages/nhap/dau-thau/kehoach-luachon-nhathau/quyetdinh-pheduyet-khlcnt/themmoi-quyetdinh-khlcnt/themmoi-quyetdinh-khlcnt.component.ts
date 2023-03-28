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
import { DanhSachGoiThau, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { STATUS } from "../../../../../../constants/status";
import { cloneDeep } from "lodash";
import {
  DxuatKhLcntService
} from "../../../../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/dxuatKhLcnt.service";
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';


@Component({
  selector: 'app-themmoi-quyetdinh-khlcnt',
  templateUrl: './themmoi-quyetdinh-khlcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khlcnt.component.scss']
})
export class ThemmoiQuyetdinhKhlcntComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  isView: boolean;
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

  listPhuongThucDauThau: any[] = [];
  listNguonVon: any[] = [];
  listHinhThucDauThau: any[] = [];
  listLoaiHopDong: any[] = [];
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
  isCheckCreate: boolean = true

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private dxuatKhlcntService: DxuatKhLcntService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
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
      soTrHdr: [''],
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
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: ['', [Validators.required]],
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

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {

  }

  async ngOnInit() {
    debugger
    console.log(this.idInput)
    console.log(this.loaiVthh)
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

  }

  async save(isGuiDuyet?) {
    debugger
    await this.spinner.show();
    if (!this.isDetailPermission()) {
      return;
    }
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
    body.children = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKem;
    let res = null;
    if (this.formData.get('id').value) {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.update(body);
    } else {
      res = await this.quyetDinhPheDuyetKeHoachLCNTService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.idInput = res.data.id;
        this.guiDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.isCheckCreate = false
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
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
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
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
        case STATUS.TU_CHOI_LDV:
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
          let res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
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
      debugger
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(id);
      this.listToTrinh = [];
      this.listDanhSachTongHop = [];
      const data = res.data;
      console.log(data)
      console.log(this.idInput)
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.formData.patchValue({
        soQd: data.soQd?.split("/")[0],
      });
      let tongMucDt = 0
      if (data.loaiVthh.startsWith("02")) {
        this.danhsachDx = data.children;
        this.danhsachDx.forEach(element => {
          tongMucDt += element.soLuong * element.donGiaVat;
        });
        this.formData.patchValue({
          tongMucDt: tongMucDt
        })
      } else {
        this.danhsachDx = data.children;
        this.danhsachDxCache = cloneDeep(this.danhsachDx);
        for (const item of this.danhsachDxCache) {
          await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.children = res.data.dsGtDtlList;
            }
          })
        }
      }
    };
  }
l
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
    // Get data tờ trình
    let bodyToTrinh = {
      trangThai: this.loaiVthh == '02' ? STATUS.DA_DUYET_LDV : STATUS.DA_DUYET_LDC,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      namKh: this.formData.get('namKhoach').value,
      loaiVthh: this.loaiVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
    }
    let resToTrinh = await this.dauThauService.search(bodyToTrinh);
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
      const res = await this.dxuatKhlcntService.getDetail(data.id)
      if (res.msg == MESSAGE.SUCCESS) {
        const dataRes = res.data;
        let tongMucDt = 0
        if (dataRes.loaiVthh.startsWith("02")) {
          this.danhsachDx = dataRes.dsGtDtlList;
          this.danhsachDx.forEach(element => {
            tongMucDt += element.soLuong * element.donGiaVat;
          });
        } else {
          dataRes.idDxHdr = data.id;
          if (dataRes.dsGtDtlList) {
            dataRes.children = dataRes.dsGtDtlList
          };
          this.danhsachDx.push(dataRes);
        }
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
          soQdCc: data.soQd,
          trichYeu: dataRes.trichYeu,
          tgianBdauTchuc: data.tgianBdauTchuc,
          tgianMthau: data.tgianMthau,
          tgianDthau: data.tgianDthau,
          tgianThien: data.tgianThien,
          gtriDthau: data.gtriDthau,
          gtriHdong: data.gtriHdong,
          vat: 5,
          tenDvi: data.tenDvi,
          maDvi: data.maDvi,
          dienGiai: data.dienGiai,
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
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow');
    this.isTongHop = this.formData.value.phanLoai == 'TH';
    console.log(this.danhsachDx);
    this.dataInput = this.danhsachDx[index];
    this.dataInputCache = this.danhsachDxCache[index];
    this.index = index;
    await this.spinner.hide();
  }

  setNewSoLuong($event) {
    this.danhsachDx[this.index].soLuong = $event;
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

}
