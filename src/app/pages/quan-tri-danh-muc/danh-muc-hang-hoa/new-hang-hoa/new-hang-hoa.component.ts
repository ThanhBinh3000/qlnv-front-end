import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { HelperService } from 'src/app/services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { LOAI_DON_VI, TrangThaiHoatDong } from 'src/app/constants/status';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DonviService} from "../../../../services/donvi.service";
import {UserService} from "../../../../services/user.service";


@Component({
  selector: 'app-new-hang-hoa',
  templateUrl: './new-hang-hoa.component.html',
  styleUrls: ['./new-hang-hoa.component.scss']
})
export class NewHangHoaComponent implements OnInit {
  @ViewChild('treeSelect', { static: false }) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formHangHoa: FormGroup;
  isVisible = false;
  dataDetail: any;
  listLhbq: any[] = [];
  listPpbq: any[] = [];
  listHtbq: any[] = [];
  listLoaiHang: any[] = [];
  listDviQly : any[] = [];
   listDviTinh: any[] = [];
   listPpLayMau: any[] = [];
  listOfOption: Array<{ maDvi: string; tenDvi: string }> = [];
  listOfTagOption: any[] = [];
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private dmHangService: DanhMucService,
    private dmDonVi: DonviService,
    private modal: NzModalRef,
    public userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    this.formHangHoa = this.fb.group({
      maCha: [null],
      tenCha: [null],
      ma: [null, Validators.required],
      ten: [null, Validators.required],
      ghiChu: [null],
      loaiHang: [null],
      trangThai: [true],
      kyHieu: [null],
      maDviTinh: [null],
      isLoaiKhoiDm: [false],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.loadListLoaiHang(),
      this.loadListDviQly(),
      this.loadDviTinh(),
      this.loadListLhBq(),
      this.loadListPpLayMau(),
      this.loadListPpbq(),
      this.loadListHtbq()
    ]);
    this.spinner.hide();
  }

  async loadListLhBq() {
    this.listLhbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLhbq = res.data;
      if (this.listLhbq) {
        this.listLhbq.forEach(item => {
          item.type = 'lhbq'
        })
      }
    }
  }

  async loadListPpbq() {
    this.listPpbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('PT_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPpbq = res.data;
      if (this.listPpbq) {
        this.listPpbq.forEach(item => {
          item.type = 'ppbq'
        })
      }
    }
  }

  async loadListPpLayMau() {
    this.listPpLayMau = [];
    let res = await this.dmHangService.danhMucChungGetAll('PP_LAY_MAU');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPpLayMau = res.data;
      if (this.listPpLayMau) {
        this.listPpLayMau.forEach(item => {
          item.type = 'pplm'
        })
      }
    }
  }

  async loadListHtbq() {
    this.listHtbq = [];
    let res = await this.dmHangService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHtbq = res.data;
      if (this.listHtbq) {
        this.listHtbq.forEach(item => {
          item.type = 'htbq'
        })
      }
    }
  }

  async loadListDviQly() {
    this.listDviQly = [];
    let res = await this.dmHangService.layTatCaDviQly();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviQly = res.data;
      if (this.listDviQly) {
        this.listOfOption = this.listDviQly.map(item => ({
          maDvi : item.maDvi,
          tenDvi : item.tenDvi
        }))
      }
    }
  }

  async loadListLoaiHang() {
    this.listLoaiHang = [];
    let res = await this.dmHangService.danhMucChungGetAll('LOAI_HANG_DTQG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHang = res.data;
    }
  }

  async loadDviTinh() {
    this.listDviTinh = [];
    let res = await this.dmHangService.danhMucChungGetAll('DON_VI_TINH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDviTinh = res.data;
    }
  }



  handleCancel(): void {
    this.modal.destroy();
  }

  convertLoaiHh(loaiVthh) {
    let loaiHh = loaiVthh
    switch (loaiHh) {
      case "1": {
        loaiHh = 'LT';
        break;
      }
      case "2" : {
        loaiHh = 'VT'
        break;
      }
      case "3": {
        loaiHh = 'VTCN';
        break;
      }
      case "4" : {
        loaiHh = 'M';
        break;
      }
      case "M": {
        loaiHh = '4';
        break;
      }
      case "VTCN" : {
        loaiHh = '3'
        break;
      }
      case "VT": {
        loaiHh = '2';
        break;
      }
      case "LT" : {
        loaiHh = '1';
        break;
      }
    }
    return loaiHh;
  }

  add() {
    this.spinner.show()
    this.helperService.markFormGroupTouched(this.formHangHoa);
    if (this.formHangHoa.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formHangHoa.value;
    body.dmHangDvqls = this.listOfTagOption;
    body.trangThai = this.formHangHoa.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    body.loaiHinhBq = this.listLhbq.filter(item => item.checked === true)
    body.phuongPhapBq = this.listPpbq.filter(item => item.checked === true)
    body.hinhThucBq = this.listHtbq.filter(item => item.checked === true)
    body.ppLayMau = this.listPpLayMau.filter(item => item.checked === true)
    body.loaiHang = this.convertLoaiHh(this.formHangHoa.value.loaiHang)
    this.dmHangService.create(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide()
      }
    }).catch((e) => {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
  }


  async nzClickNodeTree(event: any) {
    if (event.keys.length > 0) {
      let detail = event.node.origin;
      if (detail.ma) {
        this.formHangHoa.patchValue({
          maDviTinh : detail.maDviTinh ? detail.maDviTinh : null ,
          loaiHang : this.convertLoaiHh(detail.loaiHang)
        })
      }
      let ma = detail.key
      await this.dmHangService.getLastMaHang(ma).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let charLast = "00";
          let lastDvi = ma ;
          if (res.data) {
            charLast = res.data.slice(-2);
            lastDvi = res.data;
          }
          let valueNext = this.convertNumberToString(parseInt(charLast) + 1);
          let maHhMoi = res.data ? lastDvi.slice(0, -2) + valueNext : lastDvi + valueNext;
          this.formHangHoa.patchValue({
            ma : maHhMoi
          })
        }
      })
    }
  }
  convertNumberToString(value) {
    return value < 10 ? "0" + value.toString() : value.toString();
  }
}
