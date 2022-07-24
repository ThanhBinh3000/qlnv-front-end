import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chuc-nang-xuat-kho',
  templateUrl: './chuc-nang-xuat-kho.component.html',
  styleUrls: ['./chuc-nang-xuat-kho.component.scss']
})
export class ChucNangXuatKhoComponent implements OnInit {
  @Input() typeVthh: string;
  constructor(private userService :UserService) { }
  ngOnInit(): void {
  }

}
