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
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  formData: FormGroup;
  nameFile: string;
  file: File;
  dataCanCuXacDinh: CanCuXacDinh;
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.dataCanCuXacDinh) {
      this.nameFile = this.dataCanCuXacDinh.children[0]?.fileName;
      this.formData.patchValue({
        tenTaiLieu: this.dataCanCuXacDinh.tenTlieu,
      });
    }
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
    this._modalRef.close(this.formData.value);
  }

  getNameFile(event?: any) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.nameFile = fileList[0].name;
    }
    this.formData.patchValue({
      file: event.target.files[0] as File,
    });
  }

  initForm() {
    this.formData = this.fb.group({
      tenTaiLieu: [null, [Validators.required]],
      file: [null],
    });
  }
}
