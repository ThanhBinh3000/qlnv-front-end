import {saveAs} from 'file-saver';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogQuyetDinhGiaoChiTieuComponent
} from 'src/app/components/dialog/dialog-quyet-dinh-giao-chi-tieu/dialog-quyet-dinh-giao-chi-tieu.component';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {LEVEL} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DeXuatDieuChinhService} from 'src/app/services/deXuatDieuChinh.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {cloneDeep} from 'lodash';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import * as XLSX from 'xlsx';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {DialogDiaDiemKhoComponent} from 'src/app/components/dialog/dialog-dia-diem-kho/dialog-dia-diem-kho.component';

@Component({
  selector: 'app-thong-tin-de-xuat-dieu-chinh',
  templateUrl: './thong-tin-de-xuat-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-de-xuat-dieu-chinh.component.scss']
})
export class ThongTinDeXuatDieuChinhComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  deXuatDieuChinh: any = {};
  tabSelected: string = '00';

  formData: FormGroup;

  lastBreadcrumb: string;
  trangThai: string = 'Dự thảo';

  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;

  listNam: any[] = [];
  yearNow: number = 0;

  dataGiaoChiTieu: any[] = [];
  selectedCanCu: any = {};
  taiLieuDinhKemList: any[] = [];

  deXuatLT: any = {};
  deXuatMuoi: any = {};
  deXuatVatTuNhap: any = {};
  deXuatVatTuXuat: any = {};

  editLuongThucCache: { [key: string]: { edit: boolean; data: any } } = {};
  editMuoiCache: { [key: string]: { edit: boolean; data: any } } = {};
  editVatTuNhapCache: { [key: string]: { edit: boolean; data: any } } = {};
  editVatTuXuatCache: { [key: string]: { edit: boolean; data: any } } = {};

  dataVatTuCha: any[] = [];
  dataVatTuChaShow: any[] = [];
  dataVatTuCon: any[] = [];
  dataVatTuConClone: any[] = [];
  dataVatTuConShow: any[] = [];

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private deXuatDieuChinhService: DeXuatDieuChinhService,
    public globals: Globals,
    public userService: UserService,
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private danhMucService: DanhMucService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.loadDataChiTiet(this.id);
      await this.loadDanhMucHang();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDataChiTiet(id: number) {
    this.formData = this.fb.group({
      canCu: [null, [Validators.required]],
      soQD: [null],
      ngayKy: [null],
      ngayHieuLuc: [null],
      namKeHoach: [this.yearNow],
      trichYeu: [null],
      nguyenNhan: [null],
      noiDung: [null],
      loaiHangHoa: [this.tabSelected]
    });
    this.deXuatDieuChinh.trangThai = '00';
    this.deXuatVatTuNhap.chiTieu = '01';
    this.deXuatVatTuXuat.chiTieu = '00';
    if (id > 0) {
      let res = await this.deXuatDieuChinhService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.deXuatDieuChinh = res.data;
          this.deXuatDieuChinh.dxDcVtNhapList = res.data.dxDcVtList.filter(it => it.chiTieu == '01') ?? [];
          this.deXuatDieuChinh.dxDcVtXuatList = res.data.dxDcVtList.filter(it => it.chiTieu == '00') ?? [];
          this.selectedCanCu.id = this.deXuatDieuChinh?.keHoachNamId;
          this.selectedCanCu.soQuyetDinh = this.deXuatDieuChinh?.soQdKeHoachNam;

          this.dataGiaoChiTieu = [];
          let item = {
            id: this.selectedCanCu.id,
            text: this.selectedCanCu.soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);

          this.formData.controls['canCu'].setValue(
            this.selectedCanCu ? this.selectedCanCu.soQuyetDinh : '',
          );
          if (this.deXuatDieuChinh.soVanBan && this.deXuatDieuChinh.soVanBan.split('/').length > 0) {
            this.formData.controls['soQD'].setValue(
              this.deXuatDieuChinh.soVanBan.split('/')[0],
            );
          }
          if (this.deXuatDieuChinh.soVanBan && this.deXuatDieuChinh.soVanBan.split('/').length > 1) {
            this.qdTCDT = this.deXuatDieuChinh.soVanBan.split('/')[1];
          }
          this.formData.controls['ngayKy'].setValue(
            this.deXuatDieuChinh.ngayKy,
          );
          this.formData.controls['ngayHieuLuc'].setValue(
            this.deXuatDieuChinh.ngayHieuLuc,
          );
          this.formData.controls['namKeHoach'].setValue(
            this.deXuatDieuChinh.namKeHoach,
          );
          this.formData.controls['trichYeu'].setValue(
            this.deXuatDieuChinh.trichYeu,
          );
          this.formData.controls['nguyenNhan'].setValue(
            this.deXuatDieuChinh.nguyenNhan,
          );
          this.formData.controls['noiDung'].setValue(
            this.deXuatDieuChinh.noiDung,
          );
          this.formData.controls['loaiHangHoa'].setValue(
            this.deXuatDieuChinh.loaiHangHoa,
          );

          if (this.deXuatDieuChinh.fileDinhKems && this.deXuatDieuChinh.fileDinhKems.length > 0) {
            this.deXuatDieuChinh.fileDinhKemReqs = cloneDeep(this.deXuatDieuChinh.fileDinhKems);
            this.deXuatDieuChinh.fileDinhKemReqs.forEach(element => {
              element.idVirtual = element.id;
              let item = {
                id: element.idVirtual,
                text: element.fileName,
              };
              if (!this.taiLieuDinhKemList) {
                this.taiLieuDinhKemList = [];
              }
              this.taiLieuDinhKemList.push(item);
            });
          }

          // if (this.deXuatDieuChinh.dxDcltList && this.deXuatDieuChinh.dxDcltList.length > 0) {
          //   this.deXuatDieuChinh.dxDcltList.forEach(element => {
          //     if (element.diaDiemKho && element.diaDiemKho != '') {
          //       element.diemKho = JSON.parse(element.diaDiemKho);
          //     }
          //   });
          // }

          // if (this.deXuatDieuChinh.dxDcMuoiList && this.deXuatDieuChinh.dxDcMuoiList.length > 0) {
          //   this.deXuatDieuChinh.dxDcMuoiList.forEach(element => {
          //     if (element.diaDiemKho && element.diaDiemKho != '') {
          //       element.diemKho = JSON.parse(element.diaDiemKho);
          //     }
          //   });
          // }

          // if (this.deXuatDieuChinh.dxDcVtList && this.deXuatDieuChinh.dxDcVtList.length > 0) {
          //   this.deXuatDieuChinh.dxDcVtList.forEach(element => {
          //     if (element.diaDiemKho && element.diaDiemKho != '') {
          //       element.diemKho = JSON.parse(element.diaDiemKho);
          //     }
          //   });
          // }
          this.updateEditLuongThucCache();
          this.updateEditMuoiCache();
          this.updateEditVatTuNhapCache();
          this.updateEditVatTuXuatCache();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  openDialogQuyetDinhGiaoChiTieu() {
    if (this.id == 0 && !this.isView) {
      const modalQD = this.modal.create({
        nzTitle: 'Thông tin QĐ giao chỉ tiêu kế hoạch',
        nzContent: DialogQuyetDinhGiaoChiTieuComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          isDexuat: true
        },
      });
      modalQD.afterClose.subscribe((data) => {
        if (data) {
          this.spinner.show();
          this.formData.controls['canCu'].setValue(data.soQuyetDinh);
          this.selectedCanCu = data;
          this.dataGiaoChiTieu = [];
          let item = {
            id: data.id,
            text: data.soQuyetDinh,
          };
          this.dataGiaoChiTieu.push(item);
          this.deXuatDieuChinhService
            .soLuongTruocDieuChinh(this.selectedCanCu.id)
            .then((res) => {
              if (res && res.data) {
                this.deXuatDieuChinh.dxDcMuoiList = res.data.dxDcMuoiList;
                this.deXuatDieuChinh.dxDcVtNhapList = res.data.dxDcVtList.filter(it => it.chiTieu == '01') ?? [];
                this.deXuatDieuChinh.dxDcVtXuatList = res.data.dxDcVtList.filter(it => it.chiTieu == '00') ?? [];
                this.deXuatDieuChinh.dxDcltList = res.data.dxDcltList;
                this.deXuatDieuChinh.namKeHoach = res.data.namKeHoach;
                this.formData.controls['namKeHoach'].setValue(
                  this.deXuatDieuChinh.namKeHoach,
                );
                this.updateEditLuongThucCache();
                this.updateEditMuoiCache();
                this.updateEditVatTuNhapCache();
                this.updateEditVatTuXuatCache();
              }
            });
          this.spinner.hide();
        }
      });
    }
  }

  async loadDanhMucHang() {
    let res = await this.danhMucService.loadDanhMucHangGiaoChiTieu();
    let data = res.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cap == 2) {
        let child = [];
        if (data[i].child && data[i].child.length > 0) {
          for (let j = 0; j < data[i].child.length; j++) {
            let itemChild = {
              id: data[i].child[j].id,
              ten: data[i].child[j].ten,
              idParent: data[i].id,
              tenParent: data[i].ten,
              maParent: data[i].ma,
              donViTinh: data[i].child[j].maDviTinh,
              maHang: data[i].child[j].ma,
              kyHieu: data[i].kyHieu,
            };
            child.push(itemChild);
            this.dataVatTuCon.push(itemChild);
          }
        }
        let item = {
          id: data[i].id,
          ten: data[i].ten,
          child: child,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
          donViTinh: data[i].maDviTinh,
        };
        this.dataVatTuCha.push(item);
      } else if (data[i].cap == 3) {
        let itemCon = {
          id: data[i].id,
          ten: data[i].ten,
          idParent: 0,
          tenParent: '',
          maParent: '',
          donViTinh: data[i].maDviTinh,
          maHang: data[i].ma,
          kyHieu: data[i].kyHieu,
        };
        this.dataVatTuCon.push(itemCon);
      }
    }
    this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
    this.dataVatTuChaShow = cloneDeep(this.dataVatTuCha);
    this.dataVatTuConShow = cloneDeep(this.dataVatTuCon);
  }

  onInputChungLoaiHang(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.dataVatTuConShow = cloneDeep(this.dataVatTuConClone);
      this.deXuatVatTuNhap.donViTinh = '';
    } else {
      this.dataVatTuConShow = this.dataVatTuConClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectChungLoaiHang(chungLoaiHang, isAdd, item) {
    item.donViTinh = chungLoaiHang.donViTinh;
    item.maVatTu = chungLoaiHang.maHang;
    const vatTuChaFilter = this.dataVatTuCha.find(
      (vaTuCha) => vaTuCha.maHang === chungLoaiHang.maParent,
    );
    if (vatTuChaFilter) {
      item.kyHieu = vatTuChaFilter.kyHieu;
      item.donViTinh = vatTuChaFilter.donViTinh;
      item.maVatTuCha = vatTuChaFilter.maHang;
      item.tenHang = vatTuChaFilter.ten;
    } else {
      item.kyHieu = chungLoaiHang.kyHieu;
      item.donViTinh = chungLoaiHang.donViTinh;
      item.maVatTuCha = chungLoaiHang.maHang;
      item.tenHang = '';
    }
  }

  onInputTenHang(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.dataVatTuChaShow = cloneDeep(this.dataVatTuCha);
      this.deXuatVatTuNhap.maHang = '';
      this.deXuatVatTuNhap.donViTinh = '';
      this.deXuatVatTuNhap.kyHieu = '';
      this.deXuatVatTuNhap.chungLoaiHang = '';
      this.dataVatTuConClone = cloneDeep(this.dataVatTuCon);
      this.dataVatTuConShow = cloneDeep(this.dataVatTuCon);
    } else {
      this.dataVatTuChaShow = this.dataVatTuCha.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectTenHang(vatTu, isAdd, item) {
    this.dataVatTuConClone = vatTu.child;
    this.dataVatTuConShow = cloneDeep(this.dataVatTuConClone);
    item.donViTinh = vatTu.donViTinh;
    item.kyHieu = vatTu.kyHieu;
    item.maVatTuCha = vatTu.maHang;
    item.donViTinh = vatTu.donViTinh;
    if (vatTu.child && vatTu.child.length > 0) {
      item.maVatTu = '';
      item.tenVatTu = '';
      item.chungLoaiHang = '';
    } else {
      item.maVatTu = vatTu.maHang;
      item.tenVatTu = '';
      item.chungLoaiHang = '';
    }

  }

  deleteDataMultipleTag(data: any) {
    if (!this.isView) {
      this.dataGiaoChiTieu = this.dataGiaoChiTieu.filter((x) => x.id != data.id);
      this.deXuatDieuChinh.dxDcMuoiList = [];
      this.deXuatDieuChinh.dxDcVtList = [];
      this.deXuatDieuChinh.dxDcltList = [];
      this.deXuatDieuChinh.namKeHoach = 0;
      this.formData.controls['namKeHoach'].setValue(0);

      this.updateEditLuongThucCache();
      this.updateEditMuoiCache();
      // this.updateEditVatTuCache();
    }
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.deXuatDieuChinh.fileDinhKemReqs = this.deXuatDieuChinh.fileDinhKemReqs.filter((x) => x.idVirtual !== data.id);
    }
  }

  openFile(event) {
    if (!this.isView) {
      let item = {
        id: new Date().getTime(),
        text: event.name,
      };
      if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
        this.uploadFileService
          .uploadFile(event.file, event.name)
          .then((resUpload) => {
            if (!this.deXuatDieuChinh.fileDinhKemReqs) {
              this.deXuatDieuChinh.fileDinhKemReqs = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.deXuatDieuChinh.fileDinhKemReqs.push(fileDinhKem);
            this.taiLieuDinhKemList.push(item);
          });
      }
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.formData.controls['ngayHieuLuc'].value) {
      return false;
    }
    return (
      startValue.getTime() >
      this.formData.controls['ngayHieuLuc'].value.getTime()
    );
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.formData.controls['ngayKy'].value) {
      return false;
    }
    return (
      endValue.getTime() <= this.formData.controls['ngayKy'].value.getTime()
    );
  };

  selectNam() {
    this.yearNow = this.formData.get('namKeHoach').value;
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isGuiDuyet: boolean) {
    if (this.formData.valid) {
      this.spinner.show();
      try {
        this.deXuatDieuChinh.id = this.id;
        if (this.deXuatDieuChinh.trangThai == '01') {
          this.deXuatDieuChinh.soQuyetDinh = this.formData.get('soQD').value + '/' + this.qdTCDT;
          this.deXuatDieuChinh.ngayKy = this.formData.get('ngayKy').value;
          this.deXuatDieuChinh.ngayHieuLuc = this.formData.get('ngayHieuLuc').value;
        }
        this.deXuatDieuChinh.namKeHoach = this.formData.get('namKeHoach').value;
        this.deXuatDieuChinh.trichYeu = this.formData.get('trichYeu').value;
        this.deXuatDieuChinh.nguyenNhan = this.formData.get('nguyenNhan').value;
        this.deXuatDieuChinh.noiDung = this.formData.get('noiDung').value;

        let dxDcLtVtReqList = [];
        if (this.deXuatDieuChinh.dxDcltList && this.deXuatDieuChinh.dxDcltList.length > 0) {
          this.deXuatDieuChinh.dxDcltList.forEach(element => {
            let item = {
              "chiTieu": element.chiTieu,
              "donViTinh": "Tấn",
              "id": element?.id ?? null,
              "loai": "00",
              "maVatTu": element?.maVatTuThoc,
              "maVatTuCha": element?.maVatTuCha,
              "soLuongTang": element?.slTangThoc ?? 0,
              "soLuongGiam": element?.slGiamThoc ?? 0,
              // "dxDcLtVtCtList": element?.dxDcLtVtCtList,
              // "diaDiemKho": element?.diaDiemKho,
            };
            dxDcLtVtReqList.push(item);
            let itemGao = {
              "chiTieu": element.chiTieu,
              "donViTinh": "Tấn",
              "id": element?.id ?? null,
              "loai": "00",
              "maVatTu": element?.maVatTuGao,
              "maVatTuCha": element?.maVatTuCha,
              "soLuongTang": element?.slTangGao ?? 0,
              "soLuongGiam": element?.slGiamGao ?? 0,
            };
            dxDcLtVtReqList.push(itemGao);
          });
        }
        if (this.deXuatDieuChinh.dxDcMuoiList && this.deXuatDieuChinh.dxDcMuoiList.length > 0) {
          this.deXuatDieuChinh.dxDcMuoiList.forEach(element => {
            let item = {
              "chiTieu": element.chiTieu,
              "donViTinh": "Tấn",
              "id": element?.id ?? null,
              "loai": "04",
              "maVatTu": element?.maVatTu,
              "maVatTuCha": element?.maVatTuCha,
              "soLuongTang": element?.slTangMuoi ?? 0,
              "soLuongGiam": element?.slGiamMuoi ?? 0,
              // "dxDcLtVtCtList": element?.dxDcLtVtCtList,
              // "diaDiemKho": element?.diaDiemKho,
            };
            dxDcLtVtReqList.push(item);
          });
        }
        if ((this.deXuatDieuChinh.dxDcVtNhapList && this.deXuatDieuChinh.dxDcVtNhapList.length > 0) || (this.deXuatDieuChinh.dxDcVtXuatList && this.deXuatDieuChinh.dxDcVtXuatList.length > 0)) {
          this.deXuatDieuChinh.dxDcVtNhapList.forEach(element => {
            let item = {
              "chiTieu": element.chiTieu,
              "donViTinh": element.donViTinh,
              "id": element?.id ?? null,
              "loai": "02",
              "maVatTu": element?.maVatTu,
              "maVatTuCha": element?.maVatTuCha,
              "soLuongTang": element?.slTang ?? 0,
              "soLuongGiam": element?.slGiam ?? 0,
              // "dxDcLtVtCtList": element?.dxDcLtVtCtList,
              // "diaDiemKho": element?.diaDiemKho,
            };
            dxDcLtVtReqList.push(item);
          });
          this.deXuatDieuChinh.dxDcVtXuatList.forEach(element => {
            let item = {
              "chiTieu": element.chiTieu,
              "donViTinh": element.donViTinh,
              "id": element?.id ?? null,
              "loai": "02",
              "maVatTu": element?.maVatTu,
              "maVatTuCha": element?.maVatTuCha,
              "soLuongTang": element?.slTang ?? 0,
              "soLuongGiam": element?.slGiam ?? 0,
              // "dxDcLtVtCtList": element?.dxDcLtVtCtList,
              // "diaDiemKho": element?.diaDiemKho,
            };
            dxDcLtVtReqList.push(item);
          });
        }
        let body = {
          "dxDcLtVtReqList": dxDcLtVtReqList,
          "fileDinhKemReqs": this.deXuatDieuChinh.fileDinhKemReqs,
          "id": this.deXuatDieuChinh.id,
          "keHoachNamId": this.selectedCanCu.id,
          "loaiHangHoa": this.deXuatDieuChinh.loaiHangHoa,
          "namKeHoach": this.deXuatDieuChinh.namKeHoach,
          "ngayHieuLuc": this.deXuatDieuChinh.ngayHieuLuc,
          "ngayKy": this.deXuatDieuChinh.ngayKy,
          "nguyenNhan": this.deXuatDieuChinh.nguyenNhan,
          "noiDung": this.deXuatDieuChinh.noiDung,
          "soVanBan": this.deXuatDieuChinh.soQuyetDinh,
          "trichYeu": this.deXuatDieuChinh.trichYeu
        };
        if (this.id > 0) {
          let res = await this.deXuatDieuChinhService.sua(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isGuiDuyet) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.back();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } else {
          let res = await this.deXuatDieuChinhService.them(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isGuiDuyet) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '04',
          };
          let res =
            await this.deXuatDieuChinhService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '01',
          };
          let res =
            await this.deXuatDieuChinhService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          let res =
            await this.deXuatDieuChinhService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: '03',
          };
          let res =
            await this.deXuatDieuChinhService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  thongTinTrangThai(trangThai: string): string {
    if (trangThai === '00' || trangThai === '01' || trangThai === '04' || trangThai === '03') {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }

  import() {

  }

  export() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc-tong-hop')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi-tong-hop')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu-tong-hop')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-de-xuat-dieu-chinh.xlsx');
  }

  clearDataLT() {
    this.deXuatLT = {};
  }

  themMoiLT() {
    this.deXuatLT.maVatTuGao = '0102';
    this.deXuatLT.maVatTuThoc = '0101';
    this.checkDataExistLuongThuc(this.deXuatLT);
    this.clearDataLT();
  }

  editRowLT(chiTieu) {
    this.editLuongThucCache[chiTieu].edit = true;
  }

  deleteRowLT(data) {
    this.deXuatDieuChinh.dxDcltList = this.deXuatDieuChinh?.dxDcltList.filter((x) => x.chiTieu != data.chiTieu,);
  }

  cancelEditLuongThuc(chiTieu: number): void {
    const index = this.deXuatDieuChinh?.dxDcltList.findIndex(
      (item) => item.chiTieu === chiTieu,
    );
    this.editLuongThucCache[chiTieu] = {
      data: {...this.deXuatDieuChinh?.dxDcltList[index]},
      edit: false,
    };
  }

  saveEditLuongThuc(chiTieu: number): void {
    this.editLuongThucCache[chiTieu].edit = false;
    this.checkDataExistLuongThuc(this.editLuongThucCache[chiTieu].data);
  }

  updateEditLuongThucCache(): void {
    if (this.deXuatDieuChinh?.dxDcltList && this.deXuatDieuChinh?.dxDcltList.length > 0) {
      this.deXuatDieuChinh?.dxDcltList.forEach((item) => {
        this.editLuongThucCache[item.chiTieu] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  caculatorDieuChinhLT(data: any) {
    data.sdcThoc = (data?.tdcThoc ?? 0) + (data?.slTangThoc ?? 0) - (data?.slGiamThoc ?? 0);
    data.sdcGao = (data?.tdcGao ?? 0) + (data?.slTangGao ?? 0) - (data?.slGiamGao ?? 0);
    data.sdcTongSoQuyThoc = (data?.sdcThoc ?? 0) + (data?.sdcGao ?? 0) * 2;
  }

  checkDataExistLuongThuc(data) {
    if (this.deXuatDieuChinh?.dxDcltList && this.deXuatDieuChinh?.dxDcltList.length > 0) {
      let index = this.deXuatDieuChinh?.dxDcltList.findIndex(x => x.chiTieu == data.chiTieu);
      if (index != -1) {
        this.deXuatDieuChinh.dxDcltList.splice(index, 1);
      }
    } else {
      this.deXuatDieuChinh.dxDcltList = [];
    }
    this.deXuatDieuChinh.dxDcltList = [
      ...this.deXuatDieuChinh.dxDcltList,
      data,
    ];
    this.updateEditLuongThucCache();
  }

  clearDataMuoi() {
    this.deXuatMuoi = {};
  }

  themMoiMuoi() {
    this.deXuatMuoi.maVatTu = '04';
    this.checkDataExistMuoi(this.deXuatMuoi);
    this.clearDataMuoi();
  }

  editRowMuoi(chiTieu) {
    this.editMuoiCache[chiTieu].edit = true;
  }

  deleteRowMuoi(data) {
    this.deXuatDieuChinh.dxDcMuoiList = this.deXuatDieuChinh?.dxDcMuoiList.filter((x) => x.chiTieu != data.chiTieu,);
  }

  cancelEditMuoi(chiTieu: number): void {
    const index = this.deXuatDieuChinh?.dxDcMuoiList.findIndex(
      (item) => item.chiTieu === chiTieu,
    );
    this.editMuoiCache[chiTieu] = {
      data: {...this.deXuatDieuChinh?.dxDcMuoiList[index]},
      edit: false,
    };
  }

  saveEditMuoi(chiTieu: number): void {
    this.editMuoiCache[chiTieu].edit = false;
    this.checkDataExistMuoi(this.editMuoiCache[chiTieu].data);
  }

  updateEditMuoiCache(): void {
    if (this.deXuatDieuChinh?.dxDcMuoiList && this.deXuatDieuChinh?.dxDcMuoiList.length > 0) {
      this.deXuatDieuChinh?.dxDcMuoiList.forEach((item) => {
        this.editMuoiCache[item.chiTieu] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  caculatorDieuChinhMuoi(data: any) {
    data.sdc = (data?.tdc ?? 0) + (data?.slTang ?? 0) - (data?.slGiam ?? 0);
  }

  checkDataExistMuoi(data) {
    if (this.deXuatDieuChinh?.dxDcMuoiList && this.deXuatDieuChinh?.dxDcMuoiList.length > 0) {
      let index = this.deXuatDieuChinh?.dxDcMuoiList.findIndex(x => x.chiTieu == data.chiTieu);
      if (index != -1) {
        this.deXuatDieuChinh.dxDcMuoiList.splice(index, 1);
      }
    } else {
      this.deXuatDieuChinh.dxDcMuoiList = [];
    }
    this.deXuatDieuChinh.dxDcMuoiList = [
      ...this.deXuatDieuChinh.dxDcMuoiList,
      data,
    ];
    this.updateEditMuoiCache();
  }

  clearDataVatTu(chitieu) {
    if (chitieu == '01') {
      this.deXuatVatTuNhap = {};
      this.deXuatVatTuNhap.chiTieu = chitieu;
    } else {
      this.deXuatVatTuXuat = {};
      this.deXuatVatTuXuat.chiTieu = chitieu;
    }
  }

  themMoiVatTu(chitieu) {
    if (chitieu == '01') {
      // this.deXuatVatTuNhap.chiTieu = chitieu;
      this.checkDataExistVatTu(this.deXuatVatTuNhap, chitieu);
    } else {
      // this.deXuatVatTuXuat.chiTieu = chitieu;
      this.checkDataExistVatTu(this.deXuatVatTuXuat, chitieu);
    }
    this.clearDataVatTu(chitieu);
  }

  editRowVatTu(maVatTuCha, maVatTu, chiTieu) {
    if (chiTieu == '01') {
      this.editVatTuNhapCache[maVatTuCha + maVatTu].edit = true;
    } else {
      this.editVatTuXuatCache[maVatTuCha + maVatTu].edit = true;
    }
  }

  deleteRowVatTu(data) {
    this.deXuatDieuChinh.dxDcVtList = this.deXuatDieuChinh?.dxDcVtList.filter((item) => item.maVatTuCha != data.maVatTuCha && item.maVatTu != data.maVatTu);
  }

  cancelEditVatTu(maVatTuCha, maVatTu, chiTieu): void {
    if (chiTieu == '01') {
      const index = this.deXuatDieuChinh?.dxDcVtNhapList.findIndex(
        (item) => item.maVatTuCha == maVatTuCha && item.maVatTu == maVatTu,
      );
      this.editVatTuNhapCache[maVatTuCha + maVatTu] = {
        data: {...this.deXuatDieuChinh?.dxDcVtNhapList[index]},
        edit: false,
      };
    } else {
      const index = this.deXuatDieuChinh?.dxDcVtXuatList.findIndex(
        (item) => item.maVatTuCha == maVatTuCha && item.maVatTu == maVatTu,
      );
      this.editVatTuXuatCache[maVatTuCha + maVatTu] = {
        data: {...this.deXuatDieuChinh?.dxDcVtXuatList[index]},
        edit: false,
      };
    }
  }

  saveEditVatTu(maVatTuCha, maVatTu, chiTieu): void {
    if (chiTieu == '01') {
      this.editVatTuNhapCache[maVatTuCha + maVatTu].edit = false;
      this.checkDataExistVatTu(this.editVatTuNhapCache[maVatTuCha + maVatTu].data, chiTieu);
    } else {
      this.editVatTuXuatCache[maVatTuCha + maVatTu].edit = false;
      this.checkDataExistVatTu(this.editVatTuXuatCache[maVatTuCha + maVatTu].data, chiTieu);
    }
  }

  updateEditVatTuNhapCache(): void {
    if (this.deXuatDieuChinh?.dxDcVtNhapList && this.deXuatDieuChinh?.dxDcVtNhapList.length > 0) {
      this.deXuatDieuChinh?.dxDcVtNhapList.forEach((item) => {
        this.editVatTuNhapCache[item.maVatTuCha + item.maVatTu] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  updateEditVatTuXuatCache(): void {
    if (this.deXuatDieuChinh?.dxDcVtXuatList && this.deXuatDieuChinh?.dxDcVtXuatList.length > 0) {
      this.deXuatDieuChinh?.dxDcVtXuatList.forEach((item) => {
        this.editVatTuXuatCache[item.maVatTuCha + item.maVatTu] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  caculatorDieuChinhVatTu(data: any) {
    // data.sdcKeHoachNam = (data?.tdcKeHoachNam ?? 0) + (data?.dc ?? 0);
    data.sdcTongSo = (data?.slTang ?? 0) + (!isNaN(data.tdcTongSo) ? data.tdcTongSo : 0) - (data?.slGiam ?? 0);
  }

  checkDataExistVatTu(data, chitieu) {
    if (chitieu == '01') {
      if (this.deXuatDieuChinh?.dxDcVtNhapList && this.deXuatDieuChinh?.dxDcVtNhapList.length > 0) {
        let index = this.deXuatDieuChinh?.dxDcVtNhapList.findIndex(x => x.maVatTuCha == data.maVatTuCha && x.maVatTu == data.maVatTu);
        if (index != -1) {
          this.deXuatDieuChinh.dxDcVtNhapList.splice(index, 1);
        }
      } else {
        this.deXuatDieuChinh.dxDcVtNhapList = [];
      }
      this.deXuatDieuChinh.dxDcVtNhapList = [
        ...this.deXuatDieuChinh.dxDcVtNhapList,
        data,
      ];
      this.updateEditVatTuNhapCache();
    } else {
      if (this.deXuatDieuChinh?.dxDcVtXuatList && this.deXuatDieuChinh?.dxDcVtXuatList.length > 0) {
        let index = this.deXuatDieuChinh?.dxDcVtXuatList.findIndex(x => x.maVatTuCha == data.maVatTuCha && x.maVatTu == data.maVatTu);
        if (index != -1) {
          this.deXuatDieuChinh.dxDcVtXuatList.splice(index, 1);
        }
      } else {
        this.deXuatDieuChinh.dxDcVtXuatList = [];
      }
      this.deXuatDieuChinh.dxDcVtXuatList = [
        ...this.deXuatDieuChinh.dxDcVtXuatList,
        data,
      ];
      this.updateEditVatTuXuatCache();
    }

  }

  changeLoaiHangHoa() {
    this.tabSelected = this.formData.get('loaiHangHoa').value;
  }

  downloadFileKeHoach(event) {
    let body = {
      "dataType": "",
      "dataId": 0
    }
    switch (event) {
      case 'tai-lieu-dinh-kem':
        body.dataType = this.deXuatDieuChinh.fileDinhKems[0].dataType;
        body.dataId = this.deXuatDieuChinh.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.deXuatDieuChinh.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.deXuatDieuChinh.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }

  selectHangHoa(event, data, type) {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Đề xuất điều chỉnh',
      nzContent: DialogDiaDiemKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        maDvi: this.userInfo.MA_DVI,
        data: data.dxDcLtVtCtList
      },
    });
    modalTuChoi.afterClose.subscribe(async (dataRes) => {
      if (dataRes) {
        data.diemKho = [];
        data.dxDcLtVtCtList = [];
        let sumTang = 0;
        let sumGiam = 0;
        if (dataRes.length > 0) {
          dataRes.forEach(element => {
            let item = {
              id: element.id,
              text: element.title + " (" + (element.sumTang - element.sumGiam).toString() + ")",
            }
            sumTang = sumTang + element.sumTang;
            sumGiam = sumGiam + element.sumGiam;
            data.diemKho.push(item);
            if (element.dataUpdate && element.dataUpdate.length > 0) {
              data.dxDcLtVtCtList = [
                ...data.dxDcLtVtCtList,
                ...element.dataUpdate,
              ]
            }
          });
        }
        if (type == 'luong-thuc') {
          data.dcThoc = sumTang - sumGiam;
          data.dcGao = sumTang - sumGiam;
          this.caculatorDieuChinhLT(data);
        } else if (type == 'muoi') {
          data.dc = sumTang - sumGiam;
          this.caculatorDieuChinhMuoi(data);
        } else if (type == 'vat-tu') {
          data.dc = sumTang - sumGiam;
          this.caculatorDieuChinhVatTu(data);
        }
        if (data.diemKho && data.diemKho.length > 0) {
          data.diaDiemKho = JSON.stringify(data.diemKho);
        }
      }
    });
  }

  deleteDiaDiemAdd(event) {

  }
}
