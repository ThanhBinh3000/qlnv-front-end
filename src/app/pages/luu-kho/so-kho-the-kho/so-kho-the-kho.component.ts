import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ThemSoKhoTheKhoComponent } from "./them-so-kho-the-kho/them-so-kho-the-kho.component";
import { chain } from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { STATUS } from 'src/app/constants/status';
import { DonviService } from 'src/app/services/donvi.service';
import { StorageService } from 'src/app/services/storage.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent extends Base2Component implements OnInit , AfterViewInit {
  isView: boolean;
  formData: FormGroup;
  STATUS = STATUS;
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsChiCuc: any = [];
  dsDiemKho: any = [];
  openPhieuNx = false;
  idPhieuNx: any;
  isThuKho: boolean;

  offSetTop : string;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLySoKhoTheKhoService);
    super.ngOnInit();
    this.formData = this.fb.group({
      nam: [null],
      maDvi: [null],
      maChiCuc: [null],
      maDiemKho: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      ngayTaoTu: [null],
      ngayTaoDen: [null],
      idThuKho: [null],
      soSoKho: [null],
      tenTheKho: [null],
    })
    this.filterTable = {};
  }

  getOffSetTop(){
    this.offSetTop = (window.innerHeight - document.getElementById("tableView").getBoundingClientRect().top - 150) + 'px';
    console.log(this.offSetTop,window.innerHeight,document.getElementById("tableView").getBoundingClientRect().top)
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.isThuKho = this.userInfo.POSITION == 'CBTHUKHO';
      if (this.userInfo.POSITION == 'CBTHUKHO') {
        await this.searchPage();
      } else {
        if (this.userService.isChiCuc()) {
          this.changeChiCuc(this.userInfo.MA_DVI);
        }
      }
      this.loadDsHangHoa();
      this.loadDsChiCuc();
      this.getOffSetTop();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsHangHoa() {
    let res = await this.danhMucService.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listLoaiHangHoa = res.data
      }
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      this.formData.patchValue({
        tenHH: null
      })
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listChungLoaiHangHoa = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  openModalCreate(id: number, isView: boolean,isThemTheKho?:boolean,idParent? : number) {
    const modalCreate = this.modal.create({
      nzTitle: !id && isView == false ? 'Tạo sổ kho/thẻ kho' : id > 0 && isView == true ? 'Thông tin sổ kho/thẻ kho' : 'Chỉnh sửa sổ kho/thẻ kho',
      nzContent: ThemSoKhoTheKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzStyle: { top: '100px' },
      nzFooter: null,
      nzComponentParams: {
        idInput: id,
        isView: isView,
        isThemTheKho : isThemTheKho,
        idParentInput : idParent
      },
    });
    modalCreate.afterClose.subscribe((data) => {
        this.searchPage()
    });
  }

  setValidator() {
    if (!(this.userInfo.POSITION == 'CBTHUKHO')) {
      this.formData.controls["nam"].setValidators([Validators.required]);
      this.formData.controls["maDiemKho"].setValidators([Validators.required]);
      if (!this.userService.isChiCuc()) {
        this.formData.controls["maChiCuc"].setValidators([Validators.required]);
      }
    }
  }

  async searchPage() {
    this.spinner.show();
    try {
      this.helperService.removeValidators(this.formData);
      this.setValidator();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
        this.spinner.hide();
        return;
      }
      let body = this.formData.value
      body.idThuKho = this.userInfo.POSITION == 'CBTHUKHO' ? this.userInfo.ID : null;
      body.maDvi = this.userInfo.POSITION == 'CBTHUKHO' ? null : this.userInfo.MA_DVI;
      let res = await this.quanLySoKhoTheKhoService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data;
        this.buildDataToTree();
      } else {
        this.dataTable = [];
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  buildDataToTree() {
    try {
      this.dataTable = chain(this.dataTable)
        .groupBy("tenDiemKho")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenNhaKho")
            .map((v, k) => {
              if (v && v.length > 0) {
                v.idVirtual = uuidv4();
                v.forEach(nganlo => {
                  nganlo.idVirtual = uuidv4();
                  if (nganlo.children && nganlo.children.length > 0) {
                    nganlo.children.forEach(nam => {
                      nam.idVirtual = uuidv4();
                      if (nam.children && nam.children.length > 0) {
                        nam.children.forEach(soKho => {
                          soKho.idVirtual = uuidv4();
                          if (soKho.theKhoList && soKho.theKhoList.length > 0) {
                            soKho.theKhoList.forEach(theKho => {
                              theKho.idVirtual = uuidv4();
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
              return {
                idVirtual: uuidv4(),
                tenNhaKho: k,
                children: v
              };
            }
            ).value();
          return {
            idVirtual: uuidv4(),
            tenDiemKho: key,
            children: rs
          };
        }).value();
      this.expandAll();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  expandAll() {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(diemKho => {
        this.expandSet.add(diemKho.idVirtual);
        if (diemKho.children && diemKho.children.length > 0) {
          diemKho.children.forEach(nhaKho => {
            this.expandSet.add(nhaKho.idVirtual);
            if (nhaKho.children && nhaKho.children.length > 0) {
              nhaKho.children.forEach(nganLo => {
                this.expandSet.add(nganLo.idVirtual);
                if (nganLo.children && nganLo.children.length > 0) {
                  nganLo.children.forEach(nam => {
                    this.expandSet.add(nam.idVirtual);
                    if (nam.children && nam.children.length > 0) {
                      nam.children.forEach(soKho => {
                        this.expandSet.add(soKho.idVirtual);
                        if (soKho.theKhoList && soKho.theKhoList.length > 0) {
                          soKho.theKhoList.forEach(theKho => {
                            this.expandSet.add(theKho.idVirtual);
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      });
    }
  }

  clearForm() {
    this.formData.reset();
    if (this.userInfo.POSITION == 'CBTHUKHO') {
      this.searchPage();
    }
  }

  async selectRow(item: any, table: any[]) {
    if (table.length > 0) {
      table.forEach(i => i.selected = false);
      item.selected = true;
    }
  }

  openHdModal(id: number) {
    this.idPhieuNx = id;
    this.openPhieuNx = true;
  }

  closeHdModal() {
    this.idPhieuNx = null;
    this.openPhieuNx = false;
  }


  async loadDsChiCuc() {
    let res = await this.donviService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

  async changeChiCuc(event: any) {
    if (event) {
      let res = await this.donviService.layTatCaDonViByLevel(4);
      if (res && res.data) {
        this.dsDiemKho = res.data
        this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
      }
    }
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.service.delete(body).then(async () => {
            await this.searchPage();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  exportData(fileName?: string) {
    this.spinner.show();
    try {
      this.service
        .export(this.formData.value)
        .subscribe((blob) =>
          saveAs(blob, fileName ? fileName : 'data.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  ngAfterViewInit(): void {
    this.getOffSetTop();
  }
}
