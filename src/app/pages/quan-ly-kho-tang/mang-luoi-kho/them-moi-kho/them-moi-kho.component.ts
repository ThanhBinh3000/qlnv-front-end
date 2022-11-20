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
import {UserLogin} from "../../../../models/userlogin";
import {UserService} from "../../../../services/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MangLuoiKhoService} from "../../../../services/quan-ly-kho-tang/mangLuoiKho.service";
import {Globals} from "../../../../shared/globals";


@Component({
  selector: 'app-them-moi-kho',
  templateUrl: './them-moi-kho.component.html',
  styleUrls: ['./them-moi-kho.component.scss']
})

export class ThemMoiKhoComponent implements OnInit {
  @ViewChild('treeSelect', {static: false}) treeSelect!: NzTreeComponent;

  data: any;
  nodesTree: any = [];
  options = {
    useCheckbox: true
  };
  settings = {};
  formKho: FormGroup;
  isVisible = false;
  levelNode: number = 0;
  userInfo: UserLogin

  dataDetail: any;
  nodeSelected: any;
  dataTable: any[] = [];
  dvi : string = 'Tấn kho';
  theTich : string = 'm3';
  dienTich : string = 'm2';
  dsChungLoaiHangHoa: any[] =[];
  dsLoaiHangHoa: any[] =[];
   listTinhTrang: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private donviService: DonviService,
    private khoService : MangLuoiKhoService,
    private modal: NzModalRef,
    private userService: UserService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public globals : Globals
  ) {
    this.formKho = this.fb.group({
      maCha: [null],
      nganKhoId : [''],
      diaChi: [''],
      tenChiCuc : [''],
      tenNganLo: [''],
      maNganLo : [''],
      tenDiemKho: [''],
      maDiemKho : [''],
      tenNhaKho: [''],
      maNhaKho: [''],
      tenNganKho: [''],
      maNganKho :[''],
      loaiKhoId : [''],
      loaiVthh : [''],
      cloaiVthh : [''],
      trangThai: [true],
      diaDiem : [''],
      type: [true],
      ghiChu: [''],
      nhiemVu: [''],
      tichLuongTkVt: [''],
      tichLuongSdLt: [''],
      tichLuongSdVt: [''],
      tichLuongTkLt : [''],
      namSuDung: [''],
      dienTichDat : [''],
      tichLuongKdLt : [''],
      tichLuongKdVt : [''],
      theTichTk : [''],
      tinhTrangId: ['']
    })
    this.formKho.controls['maCha'].valueChanges.subscribe(value => {
      let node = this.treeSelect.getTreeNodeByKey(value);
      if (node) {
        this.levelNode = node.level + 1
      }
      // if (this.levelNode == 5) {
      //   this.levelNode = null;
      //   this.notification.error(MESSAGE.ERROR, 'Không được tạo đơn vị kho nhỏ hơn lô kho!')
      //   return;
      // }
    });
  }

  loadDetailParent(node) {
    switch (node.level) {

    }
  }



  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            }
            else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadTinhTrangLoKho() {
      this.listTinhTrang = [];
      let res = await this.danhMucService.danhMucChungGetAll('CL_KHO');
      if (res.msg == MESSAGE.SUCCESS) {
        this.listTinhTrang = res.data;
      }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.loaiVTHHGetAll(),
        this.loadDsDvi(),
        this.loadTinhTrangLoKho()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onChangeLoaiVthh(event) {
    this.dsChungLoaiHangHoa = [];
    const loaiVthh = this.dsLoaiHangHoa.filter(item => item.id == event);
    if (loaiVthh.length > 0) {
      this.dsChungLoaiHangHoa = loaiVthh[0].child;
    }
  }


  enumToSelectList() {

  }

  async loadDsDvi() {
    await this.donviService.layTatCaDviDmKho(LOAI_DON_VI.MLK, this.userInfo.MA_DVI).then((res: OldResponseData) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.nodesTree = res.data;
      }
      this.nodesTree[0].expanded = false;

    })
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  save() {
    this.helperService.markFormGroupTouched(this.formKho);
    if (this.formKho.invalid) {
      return;
    }
    let body = this.formKho.value;
    body.nganKhoId = this.formKho.value.maCha;
    this.khoService.create(body).then((res: OldResponseData) => {
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
