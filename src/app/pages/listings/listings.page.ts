import { Component, OnInit } from '@angular/core';

import { IonicSelectableComponent } from 'ionic-selectable';

import { ModalController } from '@ionic/angular';
import { ListingformComponent } from './form/listingform/listingform.component';
import { ListingService } from 'src/app/services/listing.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
})
export class ListingsPage implements OnInit {

  ports: any = {};
  port: any;

  private myToast: any;
  private myloading: any;
  provinces:any = [];

  statuses: any = [
    { id: '0', name: 'Draft' },
    { id: '2', name: 'Active' },
    { id: '3', name: 'In Negotiation' },
    { id: '4', name: 'Sold/Rented' },
    { id: '5', name: 'Expired/Unsold' },
  ];

  rooms = [
    { name: '1', checked: false },
    { name: '2', checked: false },
    { name: '3', checked: false },
    { name: '4', checked: false },
    { name: '5', checked: false },
    { name: '6', checked: false }
  ];
  beds = [
    { name: '1', checked: false },
    { name: '2', checked: false },
    { name: '3', checked: false },
    { name: '4', checked: false },
    { name: '5', checked: false },
    { name: '6', checked: false }
  ];
  baths = [
    { name: '1', checked: false },
    { name: '2', checked: false },
    { name: '3', checked: false },
    { name: '4', checked: false },
    { name: '5', checked: false },
    { name: '6', checked: false }
  ];

  queryParams: string;
  lists = [];
  slist: any;
  p: number = 1;
  limit: number = 20;
  total: number = 0;
  q: any = '';
  form: FormGroup;

  selected_house_type:any = [];
  selected_bed:any = [];
  selected_bath:any = [];
  selected_features:any = [];
  features_list:any = [];
  additional_param:string = '';
  is_searching:boolean = false;

  skeletons:any = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  house_type_all_checked:boolean = true;

  house_type_lists:any = [
    {name: 'House', checked:false},
    {name: 'Condominium', checked:false},
    {name: 'Land', checked:false},
    {name: 'Townhouse', checked:false},
    {name: 'Commercial', checked:false},
  ];

  bed_list:any = [
    {name: '1', checked:false},
    {name: '2', checked:false},
    {name: '3', checked:false},
    {name: '4', checked:false},
    {name: '5+', checked:false},
  ];

  bath_list:any = [
    {name: '1', checked:false},
    {name: '2', checked:false},
    {name: '3', checked:false},
    {name: '4', checked:false},
    {name: '5+', checked:false},
  ];

  constructor(
    public modalController: ModalController,
    private formService: ListingService,
    private toast: ToastController,
    private loading: LoadingController,
    private fb: FormBuilder,
    private comService: CommonService
  ) {
    this.ports = [
      { id: 1, name: 'Tokai' },
      { id: 2, name: 'Vladivostok' },
      { id: 3, name: 'Navlakhi' }
    ];

  }

  ngOnInit() {
    this.fetchlist();
    // this.province_list();
    this.fetchFeatures();

    this.form = this.fb.group({
      house_type: [''],
      listing_type: ['buy'],
      min_price: [''],
      max_price: [''],
      title: [''],
      beds: [''],
      baths: [''],
      sqm_min: [''],
      sqm_max: [''],
      features: ['']
    });

  }


  fetchlist() {
    this.lists = [];
    this.is_searching = true;
    this.queryParams = '?page=' + this.p + '&q=' + this.q + this.additional_param;
    this.formService.list(this.queryParams).subscribe({
      next: response => {
        this.is_searching = false;
        this.lists = response.list;
        this.total = response.total_count;
      },
      error: err => {
        this.is_searching = false;
      }
    });
  }

  // province_list() {
  //   this.comService.provinces().subscribe({
  //     next: response => {
  //       this.provinces = response.list;
  //     },
  //     error: err => {

  //     }
  //   });
  // }

  fetchFeatures() {
    this.comService.features_lists().subscribe({
        next: response => {
          this.features_list = response.features;
        },
        error: err => {
  
        }
      });
  }

  submitForm() {
    this.additional_param = '&';
    Object.keys(this.form.controls).forEach(key => {
      let v = this.form.controls[key].value;
      this.additional_param += key+'='+v+'&';
    });
    this.additional_param = this.additional_param.slice(0, -1); 
    this.fetchlist();
  }

  updateTitle(e) {
    this.q = e.target.value;
  }

  statusClass(status) {
    if(status == '2') {
      return 'green';
    }if(status == '3') {
      return 'light-green';
    }if(status == '4') {
      return 'light-gray';
    }if(status == '5') {
      return 'light-gray';
    }else {
      return 'blue';
    }
    
  }



  setListingType(val) {
    this.form.controls.listing_type.setValue(val);
    this.submitForm();
  }

  setHouseType(v) {
    if(v == 'all') {
      this.selected_house_type = [];
      this.house_type_lists.forEach(house => {
        house.checked = true;
        this.selected_house_type.push(house.name);
      });

      if(this.selected_house_type && this.selected_house_type.length > 0) {
        let b = this.selected_house_type.toString();
        console.log(b);
        this.form.controls.house_type.setValue(b);
      }else {
        this.form.controls.house_type.setValue('');
      }

      this.submitForm();

    }else {
      this.house_type_all_checked = false;
      if(this.selected_house_type.includes(v)){
        this.selected_house_type.forEach((item,index)=>{
            if(item==v) {
              this.selected_house_type.splice(index,1);
            }
        });
      }else {
          this.selected_house_type.push(v);
      }
      if(this.selected_house_type && this.selected_house_type.length > 0) {
          let b = this.selected_house_type.toString();
          this.form.controls.house_type.setValue(b);
      }else {
        this.form.controls.house_type.setValue('');
      }
    }
    
    this.submitForm();
  }

  isCheckedHouseType(v) {
    if(this.selected_house_type && this.selected_house_type.length > 0) {
      if(this.selected_house_type.includes(v)){
        return true;
      }
    }
    return false;
  }

  setBed(v) {
    
    if(this.selected_bed.includes(v)){
      this.selected_bed.forEach((item,index)=>{
          if(item==v) {
            this.selected_bed.splice(index,1);
          }
      });
    }else {
        this.selected_bed.push(v);
    }
    if(this.selected_bed && this.selected_bed.length > 0) {
        let b = this.selected_bed.toString();
        this.form.controls.beds.setValue(b);
    }else {
      this.form.controls.beds.setValue('');
    }

    

    this.submitForm();

  }

  isCheckedBed(v) {
    if(this.selected_bed && this.selected_bed.length > 0) {
      if(this.selected_bed.includes(v)){
        return true;
      }
    }
    return false;
  }

  setBath(v) {
    if(this.selected_bath.includes(v)){
      this.selected_bath.forEach((item,index)=>{
          if(item==v) {
            this.selected_bath.splice(index,1);
          }
      });
    }else {
        this.selected_bath.push(v);
    }
    if(this.selected_bath && this.selected_bath.length > 0) {
        let b = this.selected_bath.toString();
        this.form.controls.baths.setValue(b);
    }else {
      this.form.controls.baths.setValue('');
    }
    this.submitForm();
  }

  isCheckedBath(v) {
    if(this.selected_bath && this.selected_bath.length > 0) {
      if(this.selected_bath.includes(v)){
        return true;
      }
    }
    return false;
  }

  setFeature(v) {
    if(this.selected_features.includes(v)){
      this.selected_features.forEach((item,index)=>{
          if(item==v) {
            this.selected_features.splice(index,1);
          }
      });
    }else {
        this.selected_features.push(v);
    }
    if(this.selected_features && this.selected_features.length > 0) {
        let b = this.selected_features.toString();
        this.form.controls.features.setValue(b);
    }else {
      this.form.controls.features.setValue('');
    }
    this.submitForm();
  }

  isCheckedFeature(v) {
    if(this.selected_features && this.selected_features.length > 0) {
      if(this.selected_features.includes(v)){
        return true;
      }
    }
    return false;
  }

  update_sale_price(e) {
    this.submitForm();
  }

  update_rent_price(e) {
    this.submitForm();
  }

  update_min_sqm(e) {
    this.submitForm();
  }

  update_max_sqm(e) {
    this.submitForm();
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
  }

  updateCheckbox(item) {
    item.checked = !item.checked
  }

  statusChange(event, id) {
    let val = event.target.value;
    if (val) {
      this.formService.update_status(val, id).subscribe({
        next: response => {
          if (response.success) {
            this.showToast(response.message);
          }
        },
        error: err => {

        }
      });
    }
  }

  async addListing() {
    const modal = await this.modalController.create({
      component: ListingformComponent,
      cssClass: 'listing-modal',
      componentProps: { value: 123, otherValue: 234 }
    });
    modal.onDidDismiss()
      .then(() => {
        this.fetchlist();
      });
    return await modal.present();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.fetchlist();
  }

  intToString(num) {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
      return '';
    }
    let si = [
      { v: 1E3, s: "K" },
      { v: 1E6, s: "M" },
      { v: 1E9, s: "B" },
      { v: 1E12, s: "T" },
      { v: 1E15, s: "P" },
      { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }
    return si[index].s;
  }

  showToast(message, $color = 'success') {
    this.myToast = this.toast.create({
      message: message,
      position: 'top',
      color: $color,
      duration: 3000
    }).then((toastData) => {
      toastData.present();
    });
  }

  async HideToast() {
    this.myToast = await this.toast.dismiss().then(() => console.log('hided'));
  }


}
