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
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private dmHangService: DanhMucService,
    private dmDonVi: DonviService,
    private modal: NzModalRef,
    private spinner: NgxSpinnerService
  ) {
    this.formHangHoa = this.fb.group({
      maCha: [''],
      tenCha: [''],
      ma: ['', Validators.required],
      ten: ['', Validators.required],
      ghiChu: [''],
      loaiHang: ['', Validators.required],
      trangThai: [true],
      kyHieu: ['', Validators.required],
      maDviTinh: ['', Validators.required],
      dviQly: ['', Validators.required],
    })
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      this.loadListLhBq(),
      this.loadListPpbq(),
      this.loadListHtbq(),
      this.loadListLoaiHang(),
      this.loadListDviQly(),
      this.loadDviTinh(),
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
      case "3":
      case "2" : {
        loaiHh = 'VT'
        break;
      }
      case "1": {
        loaiHh = 'LT';
        break;
      }
      case "4" : {
        loaiHh = 'M';
        break;
      }
    }
    return loaiHh;
  }

  add() {
    this.helperService.markFormGroupTouched(this.formHangHoa);
    if (this.formHangHoa.invalid) {
      return;
    }
    this.formHangHoa.get('maDviTinh').setValue(this.listDviTinh.filter(item => item.ma == this.formHangHoa.value.maDviTinh));
    let body = this.formHangHoa.value;
    body.trangThai = this.formHangHoa.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    body.loaiHinhBq = this.listLhbq.filter(item => item.checked === true)
    body.phuongPhapBq = this.listPpbq.filter(item => item.checked === true)
    body.hinhThucBq = this.listHtbq.filter(item => item.checked === true)
    body.loaiHang = this.convertLoaiHh(this.formHangHoa.value.loaiHang)
    this.dmHangService.create(body).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch((e) => {
      console.error('error: ', e);
      this.notification.error(
        MESSAGE.ERROR,
        e.error.errors[0].defaultMessage,
      );
    });
  }
}
