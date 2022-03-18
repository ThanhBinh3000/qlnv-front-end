import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  formData: FormGroup;
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };
  nameFile: string;
  constructor(private _modalRef: NzModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onCancel() {
    this._modalRef.destroy();
  }
  onSave() {
    console.log(this.formData.value);

    this._modalRef.close(this.formData.value);
  }
  getNameFile(fileDialog?: any, event?: any) {
    this.nameFile = fileDialog[0].name;
    this.formData.patchValue({
      file: event.target.files[0],
    });
  }
  initForm() {
    this.formData = this.fb.group({
      tenTaiLieu: [null],
      file: [null],
    });
  }
}
