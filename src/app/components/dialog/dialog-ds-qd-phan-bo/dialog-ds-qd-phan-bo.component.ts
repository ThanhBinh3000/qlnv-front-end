import { cloneDeep, isEqual } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { environment } from 'src/environments/environment';
import { CanCuXacDinh } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';

@Component({
  selector: 'dialog-ds-qd-phan-bo',
  templateUrl: './dialog-ds-qd-phan-bo.component.html',
  styleUrls: ['./dialog-ds-qd-phan-bo.component.scss'],
})
export class DanhSachQuyetDinhPhanBoComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  formData: FormGroup;
  nameFile: string;
  file: File;
  dataCanCuXacDinh: CanCuXacDinh;
  formTaiLieu: any;
  formTaiLieuClone: any;
  type: string;
  isSave: boolean = false;
  constructor(private _modalRef: NzModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    if (this.dataCanCuXacDinh) {
      this.nameFile = this.dataCanCuXacDinh.children[0]?.fileName;
      this.formData.patchValue({
        tenTaiLieu: this.dataCanCuXacDinh.tenTlieu,
        file: this.dataCanCuXacDinh.tenTlieu,
      });
      if (this.type) {
        this.formTaiLieu = {
          tenTaiLieu: this.dataCanCuXacDinh.tenTlieu,
          file: this.nameFile,
        };
        this.formTaiLieuClone = cloneDeep(this.formTaiLieu);
      }
    }
  }

  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
  }

  onCancel() {
    this._modalRef.destroy();
  }
  onSave() {
    this._modalRef.close(this.formData.value);
  }

  getNameFile(event?: any) {
    this.isSave = true;
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.nameFile = fileList[0].name;
    }
    this.formData.patchValue({
      file: event.target.files[0] as File,
    });
    if (this.dataCanCuXacDinh) {
      this.formTaiLieuClone.file = this.nameFile;
      this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    }
  }

  initForm() {
    this.formData = this.fb.group({
      tenTaiLieu: [null, [Validators.required]],
      file: [null, [Validators.required]],
    });
  }
  changeValue(event: any) {
    this.isSave = true;
    if (this.dataCanCuXacDinh) {
      this.formTaiLieuClone.tenTaiLieu = event.target.value;
      this.isSave = !isEqual(this.formTaiLieuClone, this.formTaiLieu);
    }
  }
}
