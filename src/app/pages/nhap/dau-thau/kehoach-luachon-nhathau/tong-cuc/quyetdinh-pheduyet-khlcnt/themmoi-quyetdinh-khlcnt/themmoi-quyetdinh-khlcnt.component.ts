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
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemMoiGoiThauComponent } from 'src/app/components/dialog/dialog-them-moi-goi-thau/dialog-them-moi-goi-thau.component';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { DialogThongTinPhuLucQuyetDinhPheDuyetComponent } from 'src/app/components/dialog/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet/dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhSachGoiThau, FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DxuatKhLcntVatTuService } from 'src/app/services/dxuatKhLcntVatTuService.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, convertVthhToId } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { environment } from 'src/environments/environment';
import { STATUS } from "../../../../../../../constants/status";


@Component({
  selector: 'app-themmoi-quyetdinh-khlcnt',
  templateUrl: './themmoi-quyetdinh-khlcnt.component.html',
  styleUrls: ['./themmoi-quyetdinh-khlcnt.component.scss']
})
export class ThemmoiQuyetdinhKhlcntComponent implements OnInit {

  @Input() loaiVthh: string
  @Input() idInput: number = 0;
  @Input() dataTongHop: any;
  @Output()
  showListEvent = new EventEmitter<any>();


  formData: FormGroup;
  formThongTinDX: FormGroup;
  formThongTinChung: FormGroup;

  selectedCanCu: any = {};
  selectedPhuongAn: any = {};
  idTongHop: number
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  errorInputRequired: string = null;
  errorGhiChu: boolean = false;
  maQd: string = null;
  fileDinhKem: Array<FileDinhKem> = [];

  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  titleStatus: string = 'Dự thảo';

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

  iconButtonDuyet: string;
  titleButtonDuyet: string;

  listNam: any[] = [];
  yearNow: number = 0;

  listOfData: DanhSachGoiThau[] = [];
  mapOfExpandedData2: { [maDvi: string]: DanhSachGoiThau[] } = {};

  isVatTu: boolean = false;
  dataNguonVon: any = {};

  STATUS = STATUS

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private dxuatKhLcntVatTuService: DxuatKhLcntVatTuService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    public userService: UserService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private dauThauService: DanhSachDauThauService,
    private uploadFileService: UploadFileService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      id: [null],
      namKhoach: [dayjs().get('year'), Validators.required],
      soQd: ['', [Validators.required]],
      ngayQd: ['', [Validators.required]],
      ngayHluc: ['', [Validators.required]],
      idThHdr: [''],
      idTrHdr: [''],
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
      trangThai: [STATUS.DU_THAO],
      tchuanCluong: [''],
      tenTrangThai: ['Dự thảo'],
      lyDoTuChoi: ['']
    })
    this.formThongTinDX = this.fb.group({
      hthucLcnt: [''],
      pthucLcnt: [''],
      loaiHdong: [''],
      nguonVon: [''],
      tgianBdauTchuc: [''],
      tgianDthau: [''],
      tgianMthau: [''],
      tgianNhang: ['']
    })
    this.formThongTinChung = this.fb.group(
      {
        tenDuAn: [null],
        tenDvi: [null],
        tongMucDt: [null],
        nguonVon: [null],
        tchuanCluong: [null],
        loaiHdong: [null],
        hthucLcnt: [null],
        pthucLcnt: [null],
        donGia: [null],
        tgianBdauTchuc: [null],
        tgianMthau: [null],
        tgianDthau: [null],
        tgianNhang: [null],
        maDvi: [null]
      }
    );
  }

  setValidator() {
    if (this.isVatTu) {
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
      this.formData.controls["idThHdr"].clearValidators();
      this.formData.controls["idTrHdr"].setValidators([Validators.required]);
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
      this.formData.controls["idThHdr"].setValidators([Validators.required]);
      this.formData.controls["idTrHdr"].clearValidators();
    }
  }

  isDetailPermission() {
    if (this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_SUA") && this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return true;
    }
    return false;
  }

  deleteSelect() {

  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
      this.maQd = this.userInfo.MA_QD;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await Promise.all([
        this.loaiHangDTQGGetAll(),
        this.phuongThucDauThauGetAll(),
        this.nguonVonGetAll(),
        this.hinhThucDauThauGetAll(),
        this.loaiHopDongGetAll(),
        this.bindingDataTongHop(this.dataTongHop),
        this.loadChiTiet(this.idInput)
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  bindingDataTongHop(dataTongHop?) {
    if (dataTongHop) {
      this.formData.patchValue({
        cloaiVthh: dataTongHop.cloaiVthh,
        tenCloaiVthh: dataTongHop.tenCloaiVthh,
        loaiVthh: dataTongHop.loaiVthh,
        tenLoaiVthh: dataTongHop.tenLoaiVthh,
        namKhoach: +dataTongHop.namKhoach,
        idThHdr: dataTongHop.id,
        tchuanCluong: dataTongHop.tchuanCluong,
      })
      this.danhSachTongHopGetAll();
      this.selectMaTongHop(dataTongHop.id);
    }
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  collapse2(array: DanhSachGoiThau[], data: DanhSachGoiThau, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.idVirtual === d.idVirtual)!;
          target.expand = false;
          this.collapse2(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  getListFile(data: any) {
    if (!this.fileList) {
      this.fileList = [];
    }
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let item = {
          uid: 'fileOld_' + i.toString(),
          name: data[i].fileName,
          status: 'done',
          url: data[i].fileUrl,
          size: data[i].fileSize ? parseFloat(data[i].fileSize.replace('KB', '')) * 1024 : 0,
          id: data[i].id,
        };
        this.fileList.push(item);
      }
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      if (info.file.response) {
        let fileList = [...info.fileList];
        fileList = fileList.map(file => {
          if (file.response) {
            file.url = file.response.url;
          }
          return file;
        });
        this.fileList = [];
        for (let i = 0; i < fileList.length; i++) {
          let item = {
            uid: fileList[i].uid ?? 'fileNew_' + i.toString(),
            name: fileList[i].name,
            status: 'done',
            url: fileList[i].url,
            size: fileList[i].size,
            id: fileList[i].id,
          };
          this.fileList.push(item);
        }
      }
    } else if (info.file.status === 'error') {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  xoaFile(data) {
    this.fileList = this.fileList.filter(x => x.uid != data.uid);
  }


  async loaiHangDTQGGetAll() {
    this.listVatTuHangHoa = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVatTuHangHoa = res.data;
    }
  }

  async phuongThucDauThauGetAll() {
    this.listPhuongThucDauThau = [];
    let res = await this.danhMucService.phuongThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucDauThau = res.data;
    }
  }

  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  async hinhThucDauThauGetAll() {
    this.listHinhThucDauThau = [];
    let res = await this.danhMucService.hinhThucDauThauGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucDauThau = res.data;
    }
  }

  async loaiHopDongGetAll() {
    this.listLoaiHopDong = [];
    let res = await this.danhMucService.loaiHopDongGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = res.data;
    }
  }

  async danhSachTongHopGetAll() {
    this.spinner.show();
    let body = {
      trangThai: STATUS.CHUA_TAO_QD,
      loaiVthh: this.formData.get('loaiVthh').value,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      namKhoach: this.formData.get('namKhoach').value
    }
    let res
    if (body.loaiVthh.startsWith("02")) {
      let bodySearchVt = {
        loaiVthh: body.loaiVthh,
        trangThai: STATUS.DA_DUYET_LDV,
        trangThaiTh: STATUS.CHUA_TAO_QD
      }
      res = await this.dauThauService.search(bodySearchVt);
    } else {
      res = await this.tongHopDeXuatKHLCNTService.getAll(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (body.loaiVthh.startsWith("02")) {
        res.data.content.forEach(item => {
          if (!this.maTongHopExis(this.listToTrinh, item.id)) {
            this.listToTrinh.push({
              id: item.id,
              maTrHdr: item.soDxuat
            });
          }
        });
      } else {
        this.listDanhSachTongHop = res.data;
      }
    }
    this.spinner.hide();
  }

  maTongHopExis(listDxTh, id) {
    return listDxTh.some(function (el) {
      return el.id === id;
    });
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

  deleteItem(index) {
    this.danhsachDx = this.danhsachDx.filter((item, i) => i !== index)
  }

  async selectMaTongHop(event) {
    if (event) {
      const res = await this.tongHopDeXuatKHLCNTService.getDetail(event)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formThongTinDX.patchValue({
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          tgianBdauTchuc: [data.tgianBdauTchucTu, data.tgianBdauTchucDen],
          tgianDthau: [data.tgianDthauTu, data.tgianDthauDen],
          tgianMthau: [data.tgianMthauTu, data.tgianMthauDen],
          tgianNhang: [data.tgianNhangTu, data.tgianNhangDen],
        });
        this.formData.patchValue({
          loaiHdong: data.loaiHdong,
          pthucLcnt: data.pthucLcnt,
          hthucLcnt: data.hthucLcnt,
          nguonVon: data.nguonVon,
          tgianBdauTchuc: data.tgianBdauTchucTu,
          tgianDthau: data.tgianDthauTu,
          tgianMthau: data.tgianMthauTu,
          tgianNhang: data.tgianNhangTu,
          tchuanCluong: data?.tchuanCluong,
          idThHdr: event,
        })
        this.danhsachDx = data.hhDxKhLcntThopDtlList;
        this.danhsachDx.forEach(async (item, index) => {
          await this.dauThauService.getDetail(item.idDxHdr).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              item.dsGoiThau = res.data.dsGtDtlList;
            }
          })
        })
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async onChangeIdTrHdr(data) {
    this.spinner.show();
    this.danhsachDx = [];
    if (data) {
      const res = await this.dxuatKhLcntVatTuService.getDetail(data)
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.danhsachDx = data.dsGtDtlList;
        this.dataNguonVon.nguonVon = this.danhsachDx[0].nguonVon;
        this.dataNguonVon.tenNguonVon = this.danhsachDx[0].tenNguonVon;
        this.formData.patchValue({
          ghiChu: data.ghiChu,
          trichYeu: data.trichYeu
        })
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  async save(isGuiDuyet?) {
    if (!this.isDetailPermission()) {
      return;
    }
    this.setValidator()
    if (this.formData.invalid) {
      this.helperService.markFormGroupTouched(this.formData);
      console.log(this.formData.value);
      return;
    }
    let body = this.formData.value;
    body.soQd = body.soQd + "/" + this.maQd;
    body.dsDeXuat = this.danhsachDx;
    body.dsGoiThau = this.danhsachDx;
    body.fileDinhKems = this.fileDinhKem;
    let dataTr = this.listToTrinh.filter(item => item.id === body.idTrHdr)
    if (dataTr.length > 0) {
      body.maTrHdr = dataTr[0].maTrHdr;
    }
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
          const res = await this.quyetDinhPheDuyetKeHoachLCNTService.approve(body);
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
        this.spinner.show();
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
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getDetail(id);
      this.listToTrinh = [];
      this.listDanhSachTongHop = [];
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
        idThHdr: data.idThHdr,
        idTrHdr: data.idTrHdr,
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
        trichYeu: data.trichYeu,
        tenTrangThai: data.tenTrangThai,
        lyDoTuChoi: data.ldoTuchoi
      })
      if (this.isVatTu) {
        this.danhsachDx = data.hhQdKhlcntDtlList[0].dsGoiThau
        this.listToTrinh = [
          ...this.listToTrinh,
          {
            id: data.idTrHdr,
            maTrHdr: data.maTrHdr
          }
        ];
      } else {
        const res = await this.tongHopDeXuatKHLCNTService.getDetail( data.idThHdr);
        if (res.msg == MESSAGE.SUCCESS) {
          const data = res.data;
          this.formThongTinDX.patchValue({
            loaiHdong: data.loaiHdong,
            pthucLcnt: data.pthucLcnt,
            hthucLcnt: data.hthucLcnt,
            nguonVon: data.nguonVon,
            tgianBdauTchuc: [data.tgianBdauTchucTu, data.tgianBdauTchucDen],
            tgianDthau: [data.tgianDthauTu, data.tgianDthauDen],
            tgianMthau: [data.tgianMthauTu, data.tgianMthauDen],
            tgianNhang: [data.tgianNhangTu, data.tgianNhangDen],
          });
        }
        this.danhsachDx = data.hhQdKhlcntDtlList
        this.listDanhSachTongHop = [
          ...this.listDanhSachTongHop,
          {
            id: data.idThHdr
          }
        ]
      }
    };
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới căn cứ xác định giá',
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

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  selectHangHoa() {
    const modalTuChoi = this.modal.create({
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
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.formData.patchValue({
        loaiVthh: data.parent.ma,
        tenLoaiVthh: data.parent.ten,
        cloaiVthh: data.ma,
        tenCloaiVthh: data.ten,
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
    this.danhSachTongHopGetAll();
  }

  setValidatorForm() {

  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }

  openDialogGoiThau(data?: any, index?) {
    const modal = this.modal.create({
      nzTitle: 'Thông tin gói thầu',
      nzContent: DialogThemMoiGoiThauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        data: data,
        loaiVthh: data ? data.loaiVthh : this.formData.get('loaiVthh').value
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        console.log(res);
        console.log(index);
        res.nguonVon = this.dataNguonVon.nguonVon;
        res.tenNguonVon = this.dataNguonVon.tenNguonVon;
        if (index >= 0) {
          this.danhsachDx[index] = res;
        } else {
          this.danhsachDx.push(res);
        }
        console.log(this.danhsachDx)
      }
    });
  }

  openDialogTh() {
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
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.selectMaTongHop(data.id);
      }
    });
  }


}
