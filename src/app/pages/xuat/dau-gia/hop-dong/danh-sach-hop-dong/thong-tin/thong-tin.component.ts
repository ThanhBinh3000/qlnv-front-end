import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  DialogCanCuKQLCNTComponent
} from 'src/app/components/dialog/dialog-can-cu-kqlcnt/dialog-can-cu-kqlcnt.component';
import {
  DialogThongTinPhuLucBangGiaHopDongComponent
} from 'src/app/components/dialog/dialog-thong-tin-phu-luc-bang-gia-hop-dong/dialog-thong-tin-phu-luc-bang-gia-hop-dong.component';
import {UploadComponent} from 'src/app/components/dialog/dialog-upload/upload.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {UserLogin} from 'src/app/models/userlogin';
import {dauThauGoiThauService} from 'src/app/services/dauThauGoiThau.service';
import {UploadFileService} from 'src/app/services/uploaFile.service';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {DonviLienQuanService} from 'src/app/services/donviLienquan.service';
import {QuyetDinhPheDuyetKetQuaLCNTService} from 'src/app/services/quyetDinhPheDuyetKetQuaLCNT.service';
import {HopDongXuatHangService} from 'src/app/services/qlnv-hang/xuat-hang/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import {
  DialogCanCuQdPheDuyetKqdgComponent
} from "../../../../../../components/dialog/dialog-can-cu-qd-phe-duyet-kqdg/dialog-can-cu-qd-phe-duyet-kqdg.component";
import {QuyetDinhPheDuyetKQBanDauGiaService} from "../../../../../../services/quyetDinhPheDuyetKQBanDauGia.service";
import {HelperService} from "../../../../../../services/helper.service";
import {STATUS} from "../../../../../../constants/status";

interface DonviLienQuanModel {
  id: number;
  tenDvi: string;
  diaChi: string;
  mst: string;
  sdt: string;
  stk: string;
  nguoiDdien: string;
  chucVu: string;
  version?: number;
}

@Component({
  selector: 'app-thong-tin',
  templateUrl: './thong-tin.component.html',
  styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean = true;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  userInfo: UserLogin;
  errorGhiChu: boolean = false;
  errorInputRequired: string = null;

  detail: any = {};
  detailChuDauTu: any = {};
  detailDviCungCap: any = {};
  fileDinhKem: Array<FileDinhKem> = [];
  tabSelected: string = 'thong-tin-chung';

  optionsDonVi: any[] = [];
  optionsDonViShow: any[] = [];

  listLoaiHopDong: any[] = [];
  listGoiThau: any[] = [];
  listDviLquan: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;

  formData: FormGroup;
  maHopDongSuffix: string = '';
  dvLQuan: DonviLienQuanModel = {
    id: 0,
    tenDvi: '',
    diaChi: '',
    mst: '',
    sdt: '',
    stk: '',
    nguoiDdien: '',
    chucVu: '',
  };
  titleStatus: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  diaDiemNhapListCuc = [];
  donGiaCore: number = 0;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public globals: Globals,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private dauThauGoiThauService: dauThauGoiThauService,
    private uploadFileService: UploadFileService,
    private donviLienQuanService: DonviLienQuanService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private quyetDinhPheDuyetKQBanDauGiaService: QuyetDinhPheDuyetKQBanDauGiaService,
    private _modalService: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group(
      {
        canCu: [null],
        idGoiThau: [null],
        maHdong: [null, [Validators.required]],
        tenHd: [null],
        ngayKy: [null],
        namKh: [null],
        ngayHieuLuc: [null],
        soNgayThien: [null],
        tgianNkho: [null],
        tenVthh: [null],
        loaiVthh: [null],
        cloaiVthh: [null],
        tenCloaiVthh: [null],
        soLuong: [null],
        dviTinh: [null],
        donGiaVat: [null],
        gtriHdSauVat: [null],

        maDvi: [null],
        tenDvi: [null],
        diaChi: [null],
        mst: [null],
        sdt: [null],
        stk: [null],
        tenNguoiDdien: [null],
        chucVu: [null],
        idNthau: [null],
        ghiChu: [null],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo']
      }
    );
    this.formData.controls['donGiaVat'].valueChanges.subscribe(value => {
      if (value) {
        this.donGiaCore = value;
        const gtriHdSauVat = this.formData.controls.donGiaVat.value * this.formData.controls.soLuong.value;
        this.formData.controls['gtriHdSauVat'].setValue(gtriHdSauVat);
      } else {
        this.donGiaCore = 0;
        this.formData.controls['gtriHdSauVat'].setValue(0);
      }
    });
  }

  calculateGiaSauThue(soLuong, donGia) {
    return soLuong * donGia;
  }

  async ngOnInit() {
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    const yearNow = new Date().getUTCFullYear();
    this.maHopDongSuffix = `/${yearNow}/HĐMB`;
    this.errorInputRequired = MESSAGE.ERROR_NOT_EMPTY;
    this.userInfo = this.userService.getUserLogin();

    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,

    })
    await Promise.all([
      this.loaiDonviLienquanAll()
    ]);
    await this.loadChiTiet(this.id);
    await this.setTitle();

  }

  validateGhiChu() {
    if (this.formData.value.ghiChu && this.formData.value.ghiChu != '') {
      this.errorGhiChu = false;
    } else {
      this.errorGhiChu = true;
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hopDongXuatHangService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.formData.patchValue({
            canCu: this.detail.canCu ?? null,
            idGoiThau: this.detail.idGoiThau ?? null,
            maHdong: this.detail.soHd ? this.detail.soHd.split('/')[0] : null,
            tenHd: this.detail.tenHd ?? null,
            ngayKy: this.detail.ngayKy ?? null,
            namKh: this.detail.namKh ?? null,
            ngayHieuLuc: this.detail.tuNgayHluc && this.detail.denNgayHluc ? [this.detail.tuNgayHluc, this.detail.denNgayHluc] : null,
            soNgayThien: this.detail.soNgayThien ?? null,
            tenVthh: this.detail.tenVthh ?? null,
            loaiVthh: this.detail.loaiVthh ?? null,
            cloaiVthh: this.detail.cloaiVthh ?? null,
            tenCloaiVthh: this.detail.tenCloaiVthh ?? null,
            tgianNkho: this.detail.tgianNkho ?? null,
            soLuong: this.detail.soLuong ?? null,
            donGiaVat: this.detail.donGiaVat ?? null,
            gtriHdSauVat: this.detail.gtriHdSauVat ?? null,
            maDvi: this.detail.maDvi ?? null,
            tenDvi: this.detail.tenDvi ?? null,
            diaChi: this.detail.diaChi ?? null,
            mst: this.detail.mst ?? null,
            sdt: this.detail.sdt ?? null,
            stk: this.detail.stk ?? null,
            tenNguoiDdien: this.detail.stk ?? null,
            chucVu: this.detail.stk ?? null,
            ghiChu: this.detail.ghiChu ?? null,
            trangThai: this.detail.trangThai ?? null,
            tenTrangThai: this.detail.tenTrangThai ?? null
          })
          if (this.userService.isTongCuc) {
            this.formData.patchValue({
              dviTinh: this.detail.dviTinh ?? null
            })
          }
          this.dvLQuan = this.listDviLquan.find(item => item.id == this.detail.idNthau);
          this.fileDinhKem = this.detail.fileDinhKems;
          await this.getListGoiThau(this.detail.id);
        }
      }
    }
  }

  async loaiDonviLienquanAll() {
    this.listDviLquan = [];
    const body = {
      "typeDvi": "NT"
    };
    let res = await this.donviLienQuanService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviLquan = res.data;
    }
  }

  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    console.log("🚀 ~ file: thong-tin.component.ts ~ line 288 ~ ThongTinComponent ~ save ~ body", body)


    this.spinner.show();
    try {
      if (!this.formData.value.ghiChu && this.formData.value.ghiChu == '') {
        this.errorGhiChu = true;
      } else {
        let body = this.formData.value;
        body.soHd = `${this.formData.value.maHdong}${this.maHopDongSuffix}`;
        body.fileDinhKems = this.fileDinhKem,
          body.tuNgayHluc = this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0 ? dayjs(this.formData.value.ngayHieuLuc[0]).format('YYYY-MM-DD') : null,
          body.denNgayHluc = this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0 ? dayjs(this.formData.value.ngayHieuLuc[1]).format('YYYY-MM-DD') : null,
          delete body.ngayHieuLuc;
        delete body.maHdong;
        delete body.tenCloaiVthh;
        delete body.tenVthh;

        body.idNthau = `${this.dvLQuan.id}`;
        body.diaDiemNhapKhoReq = this.diaDiemNhapListCuc;
        if (this.id > 0) {
          body.id = this.id;
          let res = await this.hopDongXuatHangService.update(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
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
          let res = await this.hopDongXuatHangService.create(
            body,
          );
          if (res.msg == MESSAGE.SUCCESS) {
            if (!isOther) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.back();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async setTitle() {
    let trangThai = this.detail.trangThai ?? '00'
    switch (trangThai) {
      case '00': {
        this.titleStatus = 'Dự thảo';
        break;
      }
      case '02': {
        this.titleStatus = 'Đã ký';
        this.styleStatus = 'da-ban-hanh'
        break
      }
    }
  }

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.tabSelected = 'thong-tin-chung';
    this.loadChiTiet(this.id);
  }

  openDialogBang(data) {
    const modalPhuLuc = this.modal.create({
      nzTitle: 'Thông tin phụ lục bảng giá chi tiết hợp đồng',
      nzContent: DialogThongTinPhuLucBangGiaHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalPhuLuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  openDialogCanCu() {
    // if (this.id == 0) {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Kết quả lựa chọn nhà thầu',
      nzContent: DialogCanCuQdPheDuyetKqdgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        loaiVthh: this.loaiVthh
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          canCu: data.soQuyetDinh ?? null,
          namKh: +data.namKhoach ?? null,
          idGoiThau: null,
          soNgayThien: null,
          loaiVthh: data.loaiVthh,
          tenVthh: data.tenVthh,
          cloaiVthh: null,
          tenCloaiVthh: null,
          soLuong: null,
          donGiaVat: null,
        })
        await this.getListGoiThau(data.id);
      }
    });
    // }
  }

  async onChangeGoiThau(event) {
    if (event) {
      let res = await this.dauThauGoiThauService.chiTietByGoiThauId(event);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        console.log("🚀 ~ file: thong-tin.component.ts ~ line 416 ~ ThongTinComponent ~ onChangeGoiThau ~ data", data)
        this.formData.patchValue({
          soNgayThien: data.tgianThienHd ?? null,
          tenVthh: data.tenVthh ?? null,
          loaiVthh: data.loaiVthh ?? null,
          cloaiVthh: data.cloaiVthh ?? null,
          tenCloaiVthh: data.tenCloaiVthh ?? null,
          soLuong: data.soLuong ?? null,
          donGiaVat: data.donGiaTrcVat && data.vat ? (data.donGiaTrcVat + (data.donGiaTrcVat * data.vat / 100)) : null,
        })
        this.onChangeDvlq(data.idNhaThau);
        this.diaDiemNhapListCuc = data.diaDiemNhapList;
        this.diaDiemNhapListCuc.forEach(element => {
          delete element.id
        });
        if (this.userService.isTongCuc()) {
          this.formData.patchValue({
            dviTinh: data.dviTinh ?? null
          })
        }
      }
    }
  }

  back() {
    this.showListEvent.emit();
  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Tài liệu đính kèm',
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

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  onChangeDvlq(event) {
    this.dvLQuan = this.listDviLquan.find(item => item.id == event);
  }

  async getListGoiThau(idCanCu) {
    // let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getDetail(idCanCu);
    let res = await this.quyetDinhPheDuyetKQBanDauGiaService.chiTiet(idCanCu);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.listGoiThau = data.hhQdPduyetKqlcntDtlList;
    }
  }

  approve() {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có chắc chắn muốn ký hợp đồng này không?`,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 365,
      nzOnOk: async () => {
        const body = {
          id: this.detail.id,
          trangThai: STATUS.DA_KY,
        }
        let res = await this.hopDongXuatHangService.approve(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          this.isView = true;
          this.detail.trangThai = STATUS.DA_KY;
          this.setTitle();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      },
    });
  }

////////////////////
  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'Chi cục 1',
      tenDiemKho: '',
      tenNganKho: '',
      age: '10',
      address: '',
      children: [
        {
          key: `2`,
          name: "",
          tenNganKho: 'Ngăn kho 1',
          tenDiemKho: 'Điểm kho 1',
          age: '5',
          address: '',
        },
        {
          key: `3`,
          name: '',
          tenNganKho: 'Ngăn kho 2',
          tenDiemKho: 'Điểm kho 2',
          age: '5',
          address: ''
        }
      ],
    },
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({...root, level: 0, expand: false});

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], level: node.level! + 1, expand: false, parent: node});
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ////////////////////

}

export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: string;
  level?: number;
  expand?: boolean;
  address?: string;
  maDiemKho?: string;
  tenDiemKho?: string;
  tenNganKho?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
