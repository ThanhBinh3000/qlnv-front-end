import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {STATUS} from "../../../../constants/status";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {Router} from "@angular/router";
import {ThemSoKhoTheKhoComponent} from "./them-so-kho-the-kho/them-so-kho-the-kho.component";
import {chain, cloneDeep} from "lodash";
import {v4 as uuidv4} from 'uuid';
import {PAGE_SIZE_DEFAULT} from "../../../../constants/config";

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent extends Base2Component implements OnInit {
  isView: boolean;
  formData: FormGroup;
  STATUS = STATUS;
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsDonVi: any = [];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLySoKhoTheKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      nam: [null],
      maDvi: [null],
      tenDvi: [null],
      loaiHang: [null],
      maChungLoaiHang: [null],
      ngayTaoTu: [null],
      ngayTaoDen: [null],
      idThuKho: [null]
    })
    this.filterTable = {};
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await this.searchPage();
      this.loadDsHangHoa();
      console.log(this.dataTable, 333333)
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

  openModelCreate(id: number, isView: boolean) {
    const modalCreate = this.modal.create({
      nzTitle: !id && isView == false ? 'Tạo sổ kho/thẻ kho' : id > 0 && isView == true ? 'Thông tin sổ kho/thẻ kho' : 'Chỉnh sửa sổ kho/thẻ kho',
      nzContent: ThemSoKhoTheKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzStyle: {top: '100px'},
      nzFooter: null,
      nzComponentParams: {
        idInput: id,
        isView: isView
      },
    });
    modalCreate.afterClose.subscribe((data) => {
      if (data) {

      }
    });
  }

  async searchPage() {
    this.spinner.show();
    try {
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
                  console.log(nganlo.children, 'nganlo')
                  if (nganlo.children && nganlo.children.length > 0) {
                    nganlo.children.forEach(nam => {
                      nam.idVirtual = uuidv4();
                      console.log(nam.children, 'nam')
                      if (nam.children && nam.children.length > 0) {
                        nam.children.forEach(soKho => {
                          soKho.idVirtual = uuidv4();
                          console.log(soKho.children, 'soKho')
                          if (soKho.children && soKho.children.length > 0) {
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

  async clearForm() {
    this.formData.reset();
    await this.searchPage();
  }

  async selectRow(item: any, table: any[]) {
    if (table.length > 0) {
      table.forEach(i => i.selected = false);
      item.selected = true;
    }
  }

  protected readonly PAGE_SIZE_DEFAULT = PAGE_SIZE_DEFAULT;
}
