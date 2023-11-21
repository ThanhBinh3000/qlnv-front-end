import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import * as dayjs from 'dayjs';
import {saveAs} from 'file-saver';
import {API_STATUS_CODE} from 'src/app/constants/config';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DanhMucTieuChuanService} from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import {STATUS} from "../../../../../../constants/status";
import {QuyetDinhGiaTCDTNNService} from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import {DanhSachPhanLo} from 'src/app/models/KeHoachBanDauGia';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DanhSachMuaTrucTiepService} from 'src/app/services/danh-sach-mua-truc-tiep.service';
import {CanCuXacDinh, FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {UploadComponent} from 'src/app/components/dialog/dialog-upload/upload.component';
import {
  DialogThemMoiKeHoachMuaTrucTiepComponent
} from 'src/app/components/dialog/dialog-them-moi-ke-hoach-mua-truc-tiep/dialog-them-moi-ke-hoach-mua-truc-tiep.component';
import {DatePipe} from '@angular/common';
import {QuyetDinhGiaCuaBtcService} from "../../../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";


@Component({
  selector: 'app-themmoi-kehoach-muatructiep',
  templateUrl: './themmoi-kehoach-muatructiep.component.html',
  styleUrls: ['./themmoi-kehoach-muatructiep.component.scss']
})

export class ThemmoiKehoachMuatructiepComponent extends Base2Component implements OnInit, OnChanges {

  @Input()
  loaiVthhInput: string;
  @Input()
  idInput: number;
  @Input()
  showFromTH: boolean;
  @Input() isViewOnModal: boolean;
  @Input()
  isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  dataChiTieu: any;
  maTrinh: string = '';
  listNguonVon: any[] = [];

  canCuKhacList: CanCuXacDinh[] = [];
  addModelCoSo: any = {
    moTa: '',
    taiLieu: [],
  };
  taiLieuDinhKemList: any[] = [];
  listDataGroup: any[] = [];
  editBaoGiaCache: { [key: string]: { edit: boolean; data: any } } = {};
  editCoSoCache: { [key: string]: { edit: boolean; data: any } } = {};
  tongMucDtVal: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private chiTieuKeHoachNamCapTongCucService: ChiTieuKeHoachNamCapTongCucService,
    private dmTieuChuanService: DanhMucTieuChuanService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhSachMuaTrucTiepService);
    this.formData = this.fb.group({
      id: [],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      loaiHinhNx: ['', [Validators.required]],
      kieuNx: ['', [Validators.required]],
      diaChi: [],
      namKh: [dayjs().get('year')],
      soDxuat: ['', [Validators.required]],
      trichYeu: [, [Validators.required]],
      ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayPduyet: [],
      tenDuAn: [''],
      soQdCc: [, [Validators.required]],
      loaiVthh: ['0101', [Validators.required]],
      tenLoaiVthh: ['Thóc tẻ'],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [],
      moTaHangHoa: [, [Validators.required]],
      ptMua: ['', [Validators.required]],
      tchuanCluong: [null, [Validators.required]],
      giaMua: [null, [Validators.required]],
      thueGtgt: [null],
      tgianMkho: [, [Validators.required]],
      tgianKthuc: [, [Validators.required]],
      ghiChu: [null],
      tongMucDt: [null],
      tongSoLuong: [null],
      tongTienGomThue: [null],
      nguonVon: ['NGV01'],
      donGiaVat: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [null],
      idSoQdCc: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    if (this.idInput > 0) {
      // await this.getDetail(this.idInput);
    } else {
      this.initForm();
    }
    await Promise.all([
      this.loadDataComboBox(),
      this.getDataChiTieu()
    ]);
    await this.spinner.hide();
  }

  async loadDataComboBox() {
    // List nguồn vốn
    this.listNguonVon = [];
    let resNv = await this.danhMucService.danhMucChungGetAll('NGUON_VON');
    if (resNv.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = resNv.data;
    }
    // loại hình nhập xuất
    this.listLoaiHinhNx = [];
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'NHAP_TT');
    }
    // kiểu nhập xuất
    this.listKieuNx = [];
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
  }

  onChangeLhNx($event) {
    let dataNx = this.listLoaiHinhNx.filter(item => item.ma == $event);
    if (dataNx.length > 0) {
      this.formData.patchValue({
        kieuNx: dataNx[0].ghiChu
      })
    }
  }

  async getDetail(id: number) {
    if (id) {
      let data = await this.detail(id);
      if (data) {
        this.formData.patchValue({
          soDxuat: data.soDxuat?.split('/')[0],
        })
        this.maTrinh = "/" + data.soDxuat?.split('/')[1]
        this.dataTable = data.children;
        console.log(this.dataTable)
        this.fileDinhKem = data.fileDinhKems;
        this.bindingCanCu(data.ccXdgDtlList);
        this.calculatorTable();
      }
    }
  }

  initForm() {
    this.maTrinh = '/' + this.userInfo.MA_TR;
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      diaChi: this.userInfo.DON_VI.diaChi,
    })
  }

  bindingCanCu(data) {
    if (data && data.length > 0) {
      data.forEach((chiTiet) => {
        this.canCuKhacList = [...this.canCuKhacList, chiTiet];
      });
    }
  }

  selectHangHoa() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng DTQG',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: this.loaiVthhInput
      }
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
        if (data) {
          if (this.userService.isCuc()) {
            this.formData.patchValue({
              cloaiVthh: data.ma,
              tenCloaiVthh: data.ten,
              loaiVthh: data.parent.ma,
              tenLoaiVthh: data.parent.ten
            });
          } else {
            this.formData.patchValue({
              loaiVthh: data.ma,
              tenLoaiVthh: data.ten
            });
          }
          let res = await this.dmTieuChuanService.getDetailByMaHh(
            this.formData.get('cloaiVthh').value,
          );
          let body = {
            loaiGia: "LG03",
            namKeHoach: this.formData.value.namKh,
            loaiVthh: this.formData.value.loaiVthh,
            cloaiVthh: this.formData.value.cloaiVthh,
            maDvi: this.formData.value.maDvi,
            trangThai: STATUS.BAN_HANH,
          }
          let pag = await this.quyetDinhGiaTCDTNNService.getPag(body)
          if (pag.msg === MESSAGE.SUCCESS) {
            if (pag.data) {
              let giaCuThe = 0;
              pag.data.forEach(i => {
                let giaQdTcdtVat = 0;
                if (i.giaQdDcTcdtVat != null && i.giaQdDcTcdtVat > 0) {
                  giaQdTcdtVat = i.giaQdDcTcdtVat
                } else {
                  giaQdTcdtVat = i.giaQdTcdtVat
                }
                if (giaQdTcdtVat > giaCuThe) {
                  giaCuThe = giaQdTcdtVat;
                }
              })
              this.formData.patchValue({
                donGiaVat: giaCuThe
              })
            }
          }
          if (res.statusCode == API_STATUS_CODE.SUCCESS) {
            this.formData.patchValue({
              tchuanCluong: res.data ? res.data.tenQchuan : null,
            });
          }
        }
      }
    );
  }

  themMoiBangPhanLoTaiSan($event, data ?: DanhSachPhanLo, index ?: number) {
    $event.stopPropagation();
    if (!this.formData.get('loaiVthh').value) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng chọn loại hàng DTQG');
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'THÊM ĐỊA ĐIỂM NHẬP KHO',
      nzContent: DialogThemMoiKeHoachMuaTrucTiepComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        dataChiTieu: this.dataChiTieu,
        namKh: this.formData.get('namKh').value,
        loaiVthh: this.formData.get('loaiVthh').value,
        cloaiVthh: this.formData.get('cloaiVthh').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        donGiaVat: this.formData.value.donGiaVat,
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      console.log(data, 999)
      this.formData.patchValue({
        thueGtgt: data.thueVat
      })
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        if (!this.validateAddDiaDiem(data)) {
          return
        }
        console.log(data, "popup")
        this.dataTable.push(data);
      }
      this.calculatorTable();
    });
  };

  validateAddDiaDiem(dataAdd): boolean {
    let data = this.dataTable.filter(item => item.maDvi == dataAdd.maDvi);
    if (data.length > 0) {
      this.notification.error(MESSAGE.ERROR, "Chi cục " + data[0].tenDvi + " đã tồn tại. Vui lòng thêm chi cục khác");
      return false;
    }
    return true;
  }

  calculatorTable() {
    let tongMucDt: number = 0;
    // let tongSoLuong: number = 0;
    this.dataTable.forEach((item) => {
      let soLuongChiCuc = 0;
      if(item.children.length > 0){
        item.children.forEach(child => {
          soLuongChiCuc += child.soLuong;
          // tongSoLuong += child.soLuong;
          tongMucDt += child.soLuong * child.donGia * 1000
        })
      }
      // tongSoLuong += item.tongSoLuong
      item.soLuong = soLuongChiCuc;
    });
    this.formData.patchValue({
      // tongSoLuong: tongSoLuong,
      // tongMucDt: tongMucDt,
      tongTienGomThue: tongMucDt,
    });
  }

  deleteRow(i: number, y?: number) {
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
          if(y != undefined){
            this.dataTable[i].children = this.dataTable.find((res, index) => index == i).children.filter((item, index) => index != y);
          }else{
            this.dataTable = this.dataTable.filter((item, index) => index != i);
          }
          this.calculatorTable();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    let body = this.formData.value;
    if (isGuiDuyet) {
      if (this.dataTable.length == 0) {
        this.notification.error(
          MESSAGE.ERROR,
          'Danh sách số lượng địa điểm không được để trống',
        );
        return;
      }else{
        body.ngayPduyet = new Date();
      }
    }
    let pipe = new DatePipe('en-US');
    if (this.formData.get('soDxuat').value) {
      body.soDxuat = this.formData.get('soDxuat').value + this.maTrinh;
    }
    body.tgianKthuc = pipe.transform(body.tgianKthuc, 'yyyy-MM-dd HH:mm')
    body.tgianMkho = pipe.transform(body.tgianMkho, 'yyyy-MM-dd HH:mm')
    body.fileDinhKemReq = this.fileDinhKem;
    body.children = this.dataTable;
    body.tongMucDt = this.tongMucDtVal;
    body.ccXdgReq = [...this.canCuKhacList];
    let res = null;
    if (body.id) {
      res = await this.danhSachMuaTrucTiepService.update(body);
    } else {
      res = await this.danhSachMuaTrucTiepService.create(body);
    }
    // if (res.data) {
    //   if (isGuiDuyet) {
    //     await this.guiDuyet();
    //   }
    // }
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
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].setValidators([Validators.required]);
      this.formData.controls["kieuNx"].setValidators([Validators.required]);
      this.formData.controls["trichYeu"].setValidators([Validators.required]);
      this.formData.controls["ngayTao"].setValidators([Validators.required]);
      this.formData.controls["soQdCc"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["moTaHangHoa"].setValidators([Validators.required]);
      this.formData.controls["ptMua"].setValidators([Validators.required]);
      this.formData.controls["tchuanCluong"].setValidators([Validators.required]);
      this.formData.controls["giaMua"].setValidators([Validators.required]);
      this.formData.controls["tgianMkho"].setValidators([Validators.required]);
      this.formData.controls["tgianKthuc"].setValidators([Validators.required]);
    } else {
      this.formData.controls["soDxuat"].setValidators([Validators.required]);
      this.formData.controls["loaiHinhNx"].clearValidators();
      this.formData.controls["kieuNx"].clearValidators();
      this.formData.controls["trichYeu"].clearValidators();
      this.formData.controls["ngayTao"].clearValidators();
      this.formData.controls["soQdCc"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["moTaHangHoa"].clearValidators();
      this.formData.controls["ptMua"].clearValidators();
      this.formData.controls["tchuanCluong"].clearValidators();
      this.formData.controls["giaMua"].clearValidators();
      this.formData.controls["tgianMkho"].clearValidators();
      this.formData.controls["tgianKthuc"].clearValidators();
    }
  }

  async getDataChiTieu() {
      let res2 =
        await this.chiTieuKeHoachNamCapTongCucService.loadThongTinChiTieuKeHoachCucNam(
          +this.formData.get('namKh').value,
        );
      if (res2.msg == MESSAGE.SUCCESS) {
        this.dataChiTieu = res2.data;
        if(this.userService.isCuc()){
          this.formData.patchValue({
            soQdCc: res2.data.soQuyetDinh,
            idSoQdCc: res2.data.id
          });
        }
      } else {
        this.formData.patchValue({
          soQdCc: null
        });
      }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_CBV:
      case STATUS.TU_CHOI_LDC:
      case STATUS.TU_CHOI_TP:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TP;
        msg = MESSAGE.GUI_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.CHO_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_LDC;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.DA_DUYET_CBV;
        msg = MESSAGE.PHE_DUYET_CONFIRM
        break;
      }
    }
    this.approve(this.idInput, trangThai, msg, null, MESSAGE.UPDATE_SUCCESS);
  }


  tuChoi() {
    let trangThai = '';
    switch (this.formData.get('trangThai').value) {
      case STATUS.CHO_DUYET_TP: {
        trangThai = STATUS.TU_CHOI_TP;
        break;
      }
      case STATUS.CHO_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_LDC;
        break;
      }
      case STATUS.DA_DUYET_LDC: {
        trangThai = STATUS.TU_CHOI_CBV;
        break;
      }
    };
    this.reject(this.idInput, trangThai);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      await this.getDetail(this.idInput);
    };
  }

  isDisable(): boolean {
    if ((this.formData.value.trangThai == STATUS.DU_THAO || this.formData.value.trangThai == STATUS.TU_CHOI_TP ||
      this.formData.value.trangThai == STATUS.TU_CHOI_LDC || this.formData.value.trangThai == STATUS.TU_CHOI_CBV || !this.isView)
      && (this.userService.isAccessPermisson('NHDTQG_PTMTT_KHMTT_LT_DEXUAT_DUYET_LDC') || this.userService.isAccessPermisson('NHDTQG_PTMTT_KHMTT_LT_DEXUAT_DUYET_TP') || this.userService.isAccessPermisson('NHDTQG_PTMTT_KHMTT_LT_DEXUAT_THEM'))) {
      return false
    } else {
      return true
    }
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number, table: string) {
    if (table == 'can-cu-khac') {
      this.canCuKhacList = this.canCuKhacList.filter((item, i) => i !== index);
    }
    if (table == 'file-dinhkem') {
      this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index);
    }
  }

  deleteTaiLieuDinhKemTag(data: any, id, type) {
    if (id == 0) {
      this.addModelCoSo.taiLieu = [];
      this.addModelCoSo.children = [];
    } else if (id > 0) {
      this.editCoSoCache[id].data.taiLieu = [];
      this.editCoSoCache[id].data.children = [];
      this.checkDataExistCoSo(this.editCoSoCache[id].data);
    }
  }

  taiLieuDinhKem(type ?: string) {
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
            switch (type) {
              case 'tai-lieu-dinh-kem':
                this.fileDinhKem.push(fileDinhKem);
                break;
              case 'can-cu-khac':
                const taiLieuCanCuKhac = new CanCuXacDinh();
                taiLieuCanCuKhac.loaiCanCu = '01';
                taiLieuCanCuKhac.tenTlieu = res.tenTaiLieu;
                taiLieuCanCuKhac.idVirtual = new Date().getTime();
                taiLieuCanCuKhac.children = [];
                taiLieuCanCuKhac.children = [
                  ...taiLieuCanCuKhac.children,
                  fileDinhKem,
                ];
                this.canCuKhacList = [...this.canCuKhacList, taiLieuCanCuKhac];
                break;
              default:
                break;
            }
          });
      }
    });
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
          if (this.editCoSoCache[id].data.tenTlieu == null || this.editCoSoCache[id].data.tenTlieu == '') {
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

      });
  }


  editRowBaoGia(id) {
    this.editBaoGiaCache[id].edit = true;
  }

  addCoSo() {
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
      data: { ...this.canCuKhacList[index] },
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
          data: { ...item },
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

  downloadFileKeHoach(event) {
    let body = {
      dataType: '',
      dataId: 0,
    };
    switch (event) {
      case 'tai-lieu-dinh-kem':
        break;
      default:
        break;
    }
  }

  calcTongSoLuong() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongSoLuong;
        return prev;
      }, 0);
      this.formData.patchValue({
        tongSoLuong: sum,
      });
      return sum;
    }
  }

  calcTongThanhTienDeXuat() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongThanhTien;
        return prev;
      }, 0);
      this.formData.value.tongMucDt = sum;
      this.tongMucDtVal = sum;
      return sum;
    }
  }

  calcTongThanhTien() {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur.tongThanhTienVat;
        return prev;
      }, 0);
      return sum;
    }
  }

  changeNamKh() {
    this.getDataChiTieu();
  }
}
