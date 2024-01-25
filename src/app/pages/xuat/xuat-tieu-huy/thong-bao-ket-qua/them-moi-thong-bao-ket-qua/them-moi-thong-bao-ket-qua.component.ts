import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../constants/status";
import {
  ThongBaoKqTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/ThongBaoKqTieuHuy.service";
import { HoSoTieuHuyService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-tieu-huy/HoSoTieuHuy.service';
import {ActivatedRoute, Router} from "@angular/router";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {Base3Component} from "../../../../../components/base3/base3.component";

@Component({
  selector: 'app-th-them-moi-thong-bao-ket-qua',
  templateUrl: './them-moi-thong-bao-ket-qua.component.html',
  styleUrls: ['./them-moi-thong-bao-ket-qua.component.scss']
})
export class ThemMoiThongBaoKetQuaComponent extends Base3Component implements OnInit {
  fileCanCu: any[] = []

  symbol : string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: ThongBaoKqTieuHuyService,
    private hoSoTieuHuyService: HoSoTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-tieu-huy/thong-bao-kq'
    this.getId();
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get('year')],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      soThongBao: [null, [Validators.required]],
      ngayThongBao: [dayjs().format('YYYY-MM-DD')],
      soHoSo: [null, [Validators.required]],
      idHoSo: [null, [Validators.required]],
      ngayKy: [dayjs().format('YYYY-MM-DD'),[Validators.required]],
      trichYeu : [null, [Validators.required]],
      lyDo: [null, [Validators.required]],
    });
    this.symbol = '/TCDT-QLHDT';
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
  }

  async ngOnInit() {
    this.spinner.show();
    await Promise.all([
      await this.getId(),
      await this.getIdHoSo(),
      await this.initForm()
    ])
    this.spinner.hide();
  }

  idHoSo : number;
  getIdHoSo() {
    let idHoSo = this.route.snapshot.paramMap.get('idHoSo');
    if (idHoSo && +idHoSo > 0) {
      this.idHoSo = +idHoSo
    }
    if(this.idHoSo){
      this.getDetailHoSo(this.idHoSo);
    }
  }

  async initForm() {
    if (this.id) {
      await this.detail(this.id).then((res) => {
        if (res) {
          let soThongBao = res.soThongBao.split('/')[0];
          this.formData.patchValue({
            soThongBao: soThongBao,
          })
          this.getDetailHoSo(res.idHoSo);
        }
      })
    }
  }

  openDialogDanhSach() {
    if (this.disabled()) {
      return;
    }
    this.spinner.show();
    this.hoSoTieuHuyService.getHoSoToThongBao({}).then((res) => {
      this.spinner.hide();
      if (res.data) {
        res.data?.forEach(item => {
          item.ngayDen = item.thoiGianTlDen
          item.ngayTu = item.thoiGianTlTu
        })
        const modalQD = this.modal.create({
          nzTitle: 'Danh sách số hồ sơ',
          nzContent: DialogTableSelectionComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: '700px',
          nzFooter: null,
          nzComponentParams: {
            dataTable: res.data,
            dataHeader: ['Số hồ sơ', 'Trích yếu'],
            dataColumn: ['soHoSo', 'trichYeu']
          },
        });
        modalQD.afterClose.subscribe(async (data) => {
          if (data) {
            this.getDetailHoSo(data.id);
          }
        });
      }
    })
  }

  getDetailHoSo(idHoSo) {
    this.spinner.show();
    this.hoSoTieuHuyService.getDetail(idHoSo).then((res) => {
      this.spinner.hide();
      if (res.data) {
        const dataHs = res.data
        this.formData.patchValue({
          soHoSo: dataHs.soHoSo,
          idHoSo: dataHs.id,
        });
      }
    });
  }

  showSave() {
    let trangThai = this.formData.value.trangThai;
    return trangThai == STATUS.DU_THAO && this.isAccessPermisson('XHDTQG_XTH_TBKQ_THEM');
  }

  save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    if (this.formData.value.soThongBao) {
      body.soThongBao = this.formData.value.soThongBao + this.symbol
    }
    this.createUpdate(body).then((res) => {
      if (res) {
        if (isGuiDuyet) {
          this.id = res.id;
          this.formData.patchValue({
            id : res.id,
          })
          this.pheDuyet();
        } else {
          this.redirectDefault();
        }
      }
    })
  }

  disabled() {
    return this.formData.value.trangThai != STATUS.DU_THAO;
  }

  pheDuyet() {
    let trangThai
    switch (this.formData.value.trangThai) {
      // Approve
      case STATUS.DU_THAO:
        trangThai = STATUS.DA_HOAN_THANH;
        break;
    }
    this.approve(this.formData.value.id, trangThai, 'Bạn có muốn hoàn thành ?', null, 'Hoàn thành thành công');
  }

  onChangeNgayKy($event){
      this.formData.patchValue({
        thoiGianKyTu : $event[0],
        thoiGianKyDen : $event[1],
      })
  }
}
