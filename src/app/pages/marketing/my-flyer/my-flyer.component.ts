import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service'; 
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, LoadingController } from '@ionic/angular';
import { ListingService } from 'src/app/services/listing.service';
@Component({
  selector: 'app-my-flyer',
  templateUrl: './my-flyer.component.html',
  styleUrls: ['./my-flyer.component.scss'],
})
export class MyFlyerComponent implements OnInit {

  properties: any = [];
  stafflist: any = [];
  selectedStaff: any = [];
  selectedGallery:any = [];
  selectedProperty:any = [];
  isToggleSearchBox: boolean = false;
  isToggleStaffBox: boolean = false;
  isToggleQrcode: boolean = false;
  qrcodeimage:any;
  selectedImage: any;
  formatted_desc:any;

  private myToast: any;
  private myloading: any;
  form: FormGroup;

  constructor(
    private formService: ListingService,
    private comService: CommonService,
    private fb: FormBuilder,
    private toast: ToastController,
    private loading: LoadingController
  ) { 

    this.form = this.fb.group({
      description: [''],
      property_list: [''],
      title: [''],
      agent: [''],
      is_qrcode: [0]
    });

  }

  ngOnInit() {

  }

  submitForm() {

  }

  selectProp(item) {

    this.form.controls.property_list.setValue('');
    this.selectedGallery = item.gallery;
    this.selectedProperty = item;
    this.isToggleSearchBox = false;
    this.form.controls.title.setValue(item.name);

    let $html = item.description;
    // $html = $html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
    // $html = $html.replace('<br>', '\n');
    this.form.controls.description.setValue($html);
    $html = $html.slice(0, 580);
    this.formatted_desc = $html;
  }

  searchProperties(event) {
    let text = event.target.value.trim().toLowerCase();
    this.comService.properties_agent_with_images(text).subscribe({
      next: response => {
        this.properties = response.list;
        this.isToggleSearchBox = true;
      },
      error: err => {
        
      }

    });

  }

  searchStaff(event) {
    let text = event.target.value.trim().toLowerCase();
    

    this.comService.lead_members(text).subscribe({
      next: response => {
        this.stafflist = response.list;
        this.isToggleStaffBox = true;
      },
      error: err => {
        
      }

    });

  }

  selectStaff(staff) {
    this.isToggleStaffBox = false;
    this.form.controls.agent.setValue(staff.name);
    this.selectedStaff = staff;
  }

  selectImage(file) {
    this.selectedImage = file;
  }

  updateText(e) {
    let $html = e.target.value;
    // $html = $html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
    $html = $html.replace(/\n/g, '<br>');
    $html = $html.slice(0, 580);
    this.formatted_desc = $html;
  }

  updateTitle(e) {
    this.selectedProperty.name = e.target.value;
  }

  downloadFlayer() {
    const formData = new FormData();
    formData.append('propertyid', this.selectedProperty.id);
    formData.append('title', this.form.value.title);
    formData.append('description', this.form.value.description);
    formData.append('image', this.selectedImage.url);
    formData.append('staffid', this.selectedStaff.staffid);
    if(this.qrcodeimage) {
      formData.append('qrcode', this.qrcodeimage);
    }else {
      formData.append('qrcode', '');
    }
    

    this.comService.download_flyer(formData).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
      },
      error: err => {
        
      }

    });

  }

  showQrCode() {
    this.isToggleQrcode = false;
    const formData = new FormData();

    if(this.form.value.is_qrcode === true) {

      formData.append('id', this.selectedProperty.id);
      this.comService.generate_qr_code(formData).subscribe({
        next: response => {
          if(response.image) {
            this.isToggleQrcode = true;
            this.qrcodeimage = response.image;
          }
        },
        error: err => {
          
        }
  
      });
    }


    
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

  showLoading() {
    this.myloading = this.loading.create({
      message: 'Please wait...',
      spinner: 'circles'
    }).then((loadingData) => {
      loadingData.present();
    });
  }

  async hideLoading() {
    this.myloading = await this.loading.dismiss().then(() => console.log('dismissed'));
  }

}
