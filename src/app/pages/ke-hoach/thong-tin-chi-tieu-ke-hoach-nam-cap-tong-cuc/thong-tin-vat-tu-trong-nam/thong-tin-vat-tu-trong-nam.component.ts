import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-vat-tu-trong-nam',
  templateUrl: './thong-tin-vat-tu-trong-nam.component.html',
  styleUrls: ['./thong-tin-vat-tu-trong-nam.component.scss'],
})
export class ThongTinVatTuTrongNamComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  formData: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      tenDv: [null],
      maHangHoa: [{ value: null, disabled: true }, [Validators.required]],
      tenHangHoa: [null],
      donViTinh: [null],
      soLuong: [null],
      tongSo: [null],
      soLuongTheoNam1: [null],
      soLuongTheoNam2: [null],
      soLuongTheoNam3: [null],
    });
  }

  //modal func
  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
