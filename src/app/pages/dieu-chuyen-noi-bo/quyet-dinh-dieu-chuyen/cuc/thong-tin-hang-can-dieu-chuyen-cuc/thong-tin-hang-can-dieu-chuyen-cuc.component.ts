import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-thong-tin-hang-can-dieu-chuyen-cuc',
  templateUrl: './thong-tin-hang-can-dieu-chuyen-cuc.component.html',
  styleUrls: ['./thong-tin-hang-can-dieu-chuyen-cuc.component.scss']
})
export class ThongTinHangCanDieuChuyenCucComponent implements OnInit {
  // dataHeader: any[] = [];
  // dataColumn: any[] = []
  // dataTable: any[] = [];
  // code: string;
  formData: FormGroup
  fb: FormBuilder = new FormBuilder();

  dsChiCuc: any[] = [];
  dsDiemKho: any[] = [];

  dsNhaKho: any[] = [];
  dsNganKho: any[] = [];
  dsLoKho: any[] = [];

  dsDiemKhoNhan: any[] = [];

  dsNhaKhoNhan: any[] = [];
  dsNganKhoNhan: any[] = [];
  dsLoKhoNhan: any[] = [];

  dataOP: any[] = [
    {
      text: 'aaaa',
      value: 1
    },
    {
      text: 'bbbb',
      value: 2
    }
  ];

  constructor(
    private _modalRef: NzModalRef,
  ) {
    this.formData = this.fb.group({
      chiCucDC: [],
      diemKho: [],
      nhaKho: [],
      nganKho: [],
      loKho: [],
      thuKho: [],
      loaiHH: [],
      clHH: [],
      tonKho: [],
      slDC: [],
      kinhPhi: [],
      thoiGian: [],
      diemKhoNhan: [],
      nhaKhoNhan: [],
      nganKhoNhan: [],
      loKhoNhan: [],
      thuKhoNhan: [],
      thayDoiThuDo: [],
      slDCCL: [],
      tlKD: [],
      slNhapDC: [],
    }
    );
  }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

  getListNhaKho(value) {
    if (value) {
      this.formData.patchValue({
        nhaKho: []
      })
      this.dsNhaKho = Array.isArray(this.dsDiemKho) ? this.dsDiemKho.find(f => f.maDvi === value)?.children : [];
      console.log('getListNhaKho', value, this.dsNhaKho)
    }
  }

  getListNhaKhoNhan(value) {
    if (value) {
      this.formData.patchValue({
        nhaKhoNhan: []
      })
      this.dsNhaKhoNhan = Array.isArray(this.dsDiemKhoNhan) ? this.dsDiemKhoNhan.find(f => f.maDvi === value)?.children : [];
      console.log('getListNhaKhoNhan', value, this.dsNhaKhoNhan)
    }
  }

  getListNganKho(value) {
    if (value) {
      this.formData.patchValue({
        nganKho: []
      })
      this.dsNganKho = Array.isArray(this.dsNhaKho) ? this.dsNhaKho.find(f => f.maDvi === value)?.children : [];
      console.log('getListNganKho', value, this.dsNganKho)
    }
  }

  getListNganKhoNhan(value) {
    if (value) {
      this.formData.patchValue({
        nganKhoNhan: []
      })
      this.dsNganKhoNhan = Array.isArray(this.dsNhaKhoNhan) ? this.dsNhaKhoNhan.find(f => f.maDvi === value)?.children : [];
      console.log('getListNganKhoNhan', value, this.dsNganKhoNhan)
    }
  }

  getListLoKho(value) {
    if (value) {
      this.formData.patchValue({
        loKho: []
      })
      this.dsLoKho = Array.isArray(this.dsNganKho) ? this.dsNganKho.find(f => f.maDvi === value)?.children : [];
      console.log('getListLoKho', value, this.dsLoKho)
    }
  }

  getListLoKhoNhan(value) {
    if (value) {
      this.formData.patchValue({
        loKhoNhan: []
      })
      this.dsLoKhoNhan = Array.isArray(this.dsNganKhoNhan) ? this.dsNganKhoNhan.find(f => f.maDvi === value)?.children : [];
      console.log('getListLoKhoNhan', value, this.dsLoKhoNhan)
    }
  }


}
