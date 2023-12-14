import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {OldResponseData} from 'src/app/interfaces/response';
import {HelperService} from 'src/app/services/helper.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {DonviService} from 'src/app/services/donvi.service';
import {LOAI_DON_VI, TrangThaiHoatDong} from 'src/app/constants/status';
import { DanhMucService } from "../../../../services/danhmuc.service";
import {UserService} from "../../../../services/user.service";


@Component({
  selector: 'app-new-don-vi',
  templateUrl: './new-don-vi.component.html',
  styleUrls: ['./new-don-vi.component.scss']
})
export class NewDonViComponent implements OnInit {
  @ViewChild('treeSelect', {static: false}) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formDonVi: FormGroup;
  isVisible = false;
  selectedNode: any;
  optionList: string[] = [];
  cureentNodeParent: any
  levelNode: number = 0;

  dataDetail: any;
  radioValue: any;
  listAllDiaDanh : any[] = []
  listTinhThanh: any[] = [];
  listQuanHuyen: any[] = [];
  listPhuongXa: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private danhMucService : DanhMucService,
    public userService : UserService,
    private modal: NzModalRef
  ) {
    this.formDonVi = this.fb.group({
      maDviCha: [''],
      tenDvi: ['', Validators.required],
      maDvi: ['', Validators.required],
      diaChi: [''],
      tenVietTat: [''],
      sdt: [''],
      fax: [''],
      mst: [''],
      stk: [''],
      moTai: [''],
      trangThai: [false],
      type: [null],
      maTuDinhNghia: [null],
      ghiChu: [''],
      vungMien: [''],
      tinhThanhList: [],
      tinhThanh: [""],
      quanHuyen: [""],
      phuongXa: [""]
    })
    this.formDonVi.controls['maDviCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      this.levelNode = node && node.level ? node.level : null
      if (this.levelNode == 3) {
        this.formDonVi.patchValue({
          type : true
        })
      }
    });
  }


  ngOnInit(): void {
    this.loadDsKhuVuc()
  }


 async loadDsKhuVuc() {
   let res = await this.danhMucService.loadDsDiaDanhByCap({});
   if (res.msg == MESSAGE.SUCCESS) {
     this.listAllDiaDanh = res.data;
     if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
       this.listTinhThanh = this.listAllDiaDanh.filter(item => item.capDiaDanh === 1);
     }
   }
 }

  convertNumberToString(value) {
    return value < 10 ? "0" + value.toString() : value.toString();
  }

  changeTinhThanh(event) {
    if (event) {
      if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
        this.listQuanHuyen = this.listAllDiaDanh.filter(item => item.maCha == event && item.capDiaDanh === 2)
      }
    }
  }

  changeQuanHuyen(event) {
    if (event) {
      if (this.listAllDiaDanh && this.listAllDiaDanh.length > 0) {
        this.listPhuongXa = this.listAllDiaDanh.filter(item => item.maCha == event && item.capDiaDanh === 3)
      }
    }
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  setValidators() {
    if (this.levelNode == 1 ) {
      this.formDonVi.controls["tinhThanhList"].setValidators([Validators.required]);
      this.formDonVi.controls["tinhThanh"].clearValidators();
      this.formDonVi.controls["quanHuyen"].clearValidators();
      this.formDonVi.controls["phuongXa"].clearValidators();
    } else if (this.levelNode == 2) {
      this.formDonVi.controls["tinhThanhList"].clearValidators();
      this.formDonVi.controls["tinhThanh"].setValidators([Validators.required]);
      this.formDonVi.controls["quanHuyen"].setValidators([Validators.required]);
      this.formDonVi.controls["phuongXa"].setValidators([Validators.required]);
    } else {
      this.formDonVi.controls["tinhThanhList"].clearValidators();
      this.formDonVi.controls["tinhThanh"].clearValidators();
      this.formDonVi.controls["quanHuyen"].clearValidators();
      this.formDonVi.controls["phuongXa"].clearValidators();
    }
  }

  convertListDiaDanh() : any[] {
    let arr = [];
    if (this.levelNode == 1) {
      arr = this.formDonVi.value.tinhThanhList
    }
    if (this.levelNode == 2 ) {
      arr.push(this.formDonVi.value.tinhThanh);
      arr.push(this.formDonVi.value.quanHuyen);
      arr.push(this.formDonVi.value.phuongXa);
    }
      return arr;
  }

  add() {
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formDonVi);
    if (this.formDonVi.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    let body = this.formDonVi.value;
    body.trangThai = this.formDonVi.get('trangThai').value ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG;
    body.type = this.formDonVi.get('type').value == true ? LOAI_DON_VI.PB : LOAI_DON_VI.DV;
    body.listIdDiaDanh = this.convertListDiaDanh();
    this.donviService.create(body).then((res: OldResponseData) => {
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

  async changeMaDvi(dataNode) {
    if (dataNode) {
      let maDvi = dataNode.origin.key
      await this.donviService.getLastMadvi(maDvi).then((res: OldResponseData) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let charLast = "00";
          let lastDvi = dataNode.origin.key ;
          if (res.data) {
            charLast = res.data.slice(-2);
            lastDvi = res.data;
          }
          let valueNext = this.convertNumberToString(parseInt(charLast) + 1);
          let maDviMoi = res.data ? lastDvi.slice(0, -2) + valueNext : lastDvi + valueNext;
          this.formDonVi.patchValue({
            maDvi : maDviMoi
          })
        }
      })
    }
  }
}
