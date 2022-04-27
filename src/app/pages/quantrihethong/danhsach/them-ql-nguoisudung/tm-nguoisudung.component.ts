import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-tm-nguoisudung',
  templateUrl: './tm-nguoisudung.component.html',
  styleUrls: ['./tm-nguoisudung.component.scss'],
})
export class ThemMoiNSDComponent implements OnInit {
  public formGroup: FormGroup;
  statusValue = "A"
  data: any;
  constructor(
    private fb: FormBuilder,

    private router: Router,
  ) {



  }

  ngOnInit(): void {
    this.initForm()


  }



  initForm() {
    this.formGroup = this.fb.group({
      registerNumber: [this.data?.registerNumber],
      registerId: [this.data?.registerId],
      registerPhoneNumber: [this.data?.registerPhoneNumber ?? ""],
      teamLeader: [this.data?.teamLeader ?? ""],
      leaderPhoneNumber: [this.data?.leaderPhoneNumber ?? ""],
      usingManager: [this.data?.usingManager ?? ""],
      registerDeptId: [this.data?.registerDeptId ?? "", Validators.required],
      registerDate: [this.data?.registerDate ?? new Date()],
      meetingSchedulerId: [this.data?.meetingSchedulerId ?? ""],
      numberUser: [this.data?.numberUser ?? 0, Validators.required],
      pickUpPlace: [this.data?.pickUpPlace ?? "", Validators.required],
      destination: [this.data?.destination ?? "", Validators.required],
      fromDate: [this.data?.fromDate ?? new Date(), Validators.required],
      toDate: [this.data?.toDate, Validators.required],
      carId: [this.data?.carId ?? ""],
      driverId: [this.data?.driverId ?? ""],
      registerName: [this.data?.registerName],
      status: ["A"],

    });
  }




  // danh mục xe tim theo don vi 
  danhsachxe(deptId) {
    const body = {
      "pageInfo": {
        "page": 1,
        "pageSize": 100
      },
      "sorts": [
        {
          "field": "",
          "dir": 0
        }
      ],
      "filters": [
        {
          "field": "",
          "value": ""
        }
      ],
      "deptIdManager": deptId,
    }


  }


}
