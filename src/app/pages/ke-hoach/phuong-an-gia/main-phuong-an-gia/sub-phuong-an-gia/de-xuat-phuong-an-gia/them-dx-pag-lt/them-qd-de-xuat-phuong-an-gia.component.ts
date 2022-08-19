import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDdiemDeHangComponent } from 'src/app/components/dialog/dialog-ddiem-de-hang/dialog-ddiem-de-hang.component';
import { API_STATUS_CODE } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { CanCuXacDinhPag, ThongTinKhaoSatGia } from 'src/app/models/DeXuatPhuongAnGia';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucTieuChuanService } from 'src/app/services/danhMucTieuChuan.service';
import { GiaDeXuatGiaService } from 'src/app/services/gia-de-xuat-gia.service';
import { HelperService } from 'src/app/services/helper.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-qd-de-xuat-phuong-an-gia',
  templateUrl: './them-qd-de-xuat-phuong-an-gia.component.html',
  styleUrls: ['./them-qd-de-xuat-phuong-an-gia.component.scss']
})
export class ThemQdDeXuatPhuongAnGiaComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input()
  idInput: number;
  @Output('onClose') onClose = new EventEmitter<any>();
  @Input()
  type: string;

  formData: FormGroup;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsHangHoa: any[] = [];

  taiLieuDinhKemList: any[] = [];
  dsNam: any[] = [];
  dsBoNganh: any[] = [];
  listQdGoc: any[] = [];
  userInfo: UserLogin;
  soDeXuat: string;
  dsLoaiGia: any[] = [];
  dsDiaDiemDeHang: any[] = [];
  dsPhuongAnGia: any[] = [];
  dsLoaiHangXdg: any[] = [];

  maDx: string;

  dataTableCanCuXdg: any[] = [];
  rowItemCcXdg: CanCuXacDinhPag = new CanCuXacDinhPag();

  dataTableKsGia: any[] = [];

  dataTableKqGia: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private giaDeXuatGiaService: GiaDeXuatGiaService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private uploadFileService: UploadFileService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        namKeHoach: [dayjs().get('year'), [Validators.required]],
        soDeXuat: [, [Validators.required]],
        loaiVthh: [null, [Validators.required]],
        ngayKy: [null, [Validators.required]],
        loaiGia: [null, [Validators.required]],
        trichYeu: [null],
        trangThai: ['00'],
        cloaiVthh: [null, [Validators.required]],
        moTa: [null],
        tchuanCluong: [null],
        giaDeNghi: [null, [Validators.required]],
        vat: [5],
        giaDeNghiVat: [null],
        soLuong: [],
        ghiChu: [],
        diaDiemDeHang: [null, [Validators.required]],
        //Form căn cứ phương pháp xác định giá
        maPphapXdg: [null, [Validators.required]],
        loaiHangXdg: [],
        giaVonNk: [],
        chiPhiChung: [],
        chiPhiPbo: [],
        tongChiPhi: [],
        noiDung: [null]
      }
    );
    this.formData.controls['giaDeNghi'].valueChanges.subscribe(value => {
      const gtriHdSauVat = this.formData.controls.giaDeNghi.value + (this.formData.controls.giaDeNghi.value / 100 * this.formData.controls.vat.value);
      this.formData.controls['giaDeNghiVat'].setValue(gtriHdSauVat);
    });
    this.formData.controls['vat'].valueChanges.subscribe(value => {
      const gtriHdSauVat = this.formData.controls.giaDeNghi.value + (this.formData.controls.giaDeNghi.value / 100 * this.formData.controls.vat.value);
      this.formData.controls['giaDeNghiVat'].setValue(gtriHdSauVat);
    })
    this.formData.controls['giaVonNk'].valueChanges.subscribe(value => {
      const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value + this.formData.controls.chiPhiPbo.value
      this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
    })
    this.formData.controls['chiPhiChung'].valueChanges.subscribe(value => {
      const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value + this.formData.controls.chiPhiPbo.value
      this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
    })
    this.formData.controls['chiPhiPbo'].valueChanges.subscribe(value => {
      const tongChiPhi = this.formData.controls.giaVonNk.value + this.formData.controls.chiPhiChung.value + this.formData.controls.chiPhiPbo.value
      this.formData.controls['tongChiPhi'].setValue(tongChiPhi);
    })

  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      this.loadDsNam(),
      this.loadDsLoaiGia(),
      this.loadDsPhuongAnGia(),
      this.loadDsHangHoaPag(),
      this.loadDsVthh(),
      this.maDx = '/CDTVP-KH&QLHDT',
      this.getDataDetail(this.idInput),
    ])
    this.spinner.hide();
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.giaDeXuatGiaService.getDetail(id);
      const data = res.data;
      this.formData.patchValue({
        id: data.id,
        namKeHoach: data.namKeHoach,
        soDeXuat: data.soDeXuat.split('/')[0],
        loaiVthh: data.loaiVthh,
        ngayKy: data.ngayKy,
        loaiGia: data.loaiGia,
        trichYeu: data.trichYeu,
        trangThai: data.trangThai,
        cloaiVthh: data.cloaiVthh,
        moTa: data.moTa,
        tchuanCluong: data.tchuanCluong,
        giaDeNghi: data.giaDeNghi,
        vat: data.vat,
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
        noiDung: data.noiDung
      })
      this.dataTableCanCuXdg = data.canCuPhapLy;
      this.dataTableKsGia = data.ketQuaKhaoSatGiaThiTruong;
      this.dataTableKqGia = data.ketQuaThamDinhGia
      this.taiLieuDinhKemList = data.fileDinhKems;
    }
  }

  async loadDsLoaiGia() {
    this.dsLoaiGia = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_GIA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsLoaiGia = res.data;
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
    let res = await this.danhMucTieuChuanService.getDetailByMaHh(event);
    if (res.statusCode == API_STATUS_CODE.SUCCESS) {
      this.formData.patchValue({
        tchuanCluong: res.data ? res.data.tenQchuan : null
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
          }
          else {
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

  bidingFile(fileDinhKem: FileDinhKem, resUpload) {

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

  downloadFileKeHoach(event) { }

  quayLai() {
    this.onClose.emit();
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
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: '11',
          };
          let res =
            await this.giaDeXuatGiaService.approve(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.BAN_HANH_SUCCESS);
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
  async save() {
    console.log(this.taiLieuDinhKemList)
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData.value)
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.taiLieuDinhKemList;
    body.soDeXuat = body.soDeXuat + this.maDx;
    body.canCuPhapLy = this.dataTableCanCuXdg;
    body.ketQuaKhaoSatGiaThiTruong = this.dataTableKsGia;
    body.ketQuaThamDinhGia = this.dataTableKqGia;
    body.diaDiemDeHangs = this.dsDiaDiemDeHang;
    body.type = this.type;
    console.log(body);

    let res
    if (this.idInput > 0) {
      res = await this.giaDeXuatGiaService.update(body);
    } else {
      res = await this.giaDeXuatGiaService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  xoaKeHoach() { }

  themKeHoach() { }

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

  themDataTable(tableName: String) {
    if (tableName == 'ccXdg') {
      this.dataTableCanCuXdg = [...this.dataTableCanCuXdg, this.rowItemCcXdg];
      this.rowItemCcXdg = new CanCuXacDinhPag();
    }
  }
}


