import {Component, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-dialog-pag-qd-tcdtnn',
  templateUrl: './dialog-pag-qd-tcdtnn.component.html',
  styleUrls: ['./dialog-pag-qd-tcdtnn.component.scss']
})
export class DialogPagQdTcdtnnComponent implements OnInit {
  dataTable: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  constructor(
    private _modalRef: NzModalRef,
  ) {
    this.formData = this.fb.group({
      loaiVthh : [null, Validators.required],
      cloaiVthh : [null, Validators.required],
      loaiQd: ['00']
    });
  }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

}
