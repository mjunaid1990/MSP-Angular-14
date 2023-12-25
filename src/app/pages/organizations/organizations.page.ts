import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { CommonService } from 'src/app/services/common.service';
import  { OrganizationsService } from 'src/app/services/organizations.service'
import { IonModal } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';


@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.page.html',
  styleUrls: ['./organizations.page.scss'],
})
export class OrganizationsPage implements OnInit {

  orgForm: FormGroup;
  editID:any;
  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;


  userImagePlaceholder:any = './../../../assets/placeholder-image.jpg';
  
  logo_image_url = '';
  light_logo_image_url = '';
  dark_logo_image_url = '';

  queryParams: string;
  lists = [];
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  q:any = '';
  isModalOpen = false;
  isModalOpenDelete = false;
  organizations:any = [];
  buildings_d:any = [];
  provinces_d:any = [];
  districts_d:any = [];

  constructor(
    private fb: FormBuilder, 
    private userService: UsersService,
    private orgService: OrganizationsService,
    private comService: CommonService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
    ) { }

  ngOnInit() {
    this.fetchlist();
    this.buildings('');
    this.provinces();
    this.orgForm = this.fb.group({
      name: ['', [Validators.required]],
      o_phone: [''],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      active: [''],
      master_feed: [''],
      master_feed_dd: [''],
      master_feed_hipflat: [''],
      o_type: [''],
      o_project_id: [''],
      c_project_id: [''],
      province:[''],
      district:[''],
      o_lead_auto_response:[''],
      o_color:[''],
      logo:[''],
      light_logo:[''],
      dark_logo:[''],
      logo_image:[''],
      light_logo_image:[''],
      dark_logo_image:[''],

    });

  }

  fetchlist() {
    this.queryParams = '?page=' + this.p + '&q='+this.q;
    this.orgService.list(this.queryParams).subscribe({
      next: response => {
        this.lists = response.list;
        this.total = response.total_count;
      },
      error: err => {
        
      }
    });
  }


  searchBuildings(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.buildings_d;
      event.component.endSearch();
      return;
    }

    this.comService.buildings(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }
      
    });

  }

  buildingChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.orgForm.controls.o_project_id.setValue(event.value.id);
  }

  buildings(q:string = '') {
    this.comService.buildings(q).subscribe({
      next: response => {
        this.buildings_d = response.list;
      },
      error: err => {
        
      }
    });
  }

  provinces() {
    this.comService.provinces().subscribe({
      next: response => {
        this.provinces_d = response.list;
      },
      error: err => {
        
      }
    });
  }

  districts(e) {
    if(this.editID) {
      this.comService.districts(e).subscribe({
        next: response => {
          this.districts_d = response.list;
        },
        error: err => {
          
        }
      });
    }else {
      this.comService.districts(e.target.value).subscribe({
        next: response => {
          this.districts_d = response.list;
        },
        error: err => {
          
        }
      });
    }
    
  }

  searchQuery(e) {
    this.q = e.target.value;
    this.fetchlist();
  }

  addNew() {
    this.isModalOpen = true;
    this.orgForm.reset();
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.orgForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      const formData = new FormData();

      if(this.orgForm.value.logo) {
        formData.append('logo', this.orgForm.value.logo);
      }
      if(this.orgForm.value.light_logo) {
        formData.append('light_logo', this.orgForm.value.light_logo);
      }
      if(this.orgForm.value.dark_logo) {
        formData.append('dark_logo', this.orgForm.value.dark_logo);
      }

      
      
      formData.append('name', this.orgForm.value.name);
      formData.append('o_phone', this.orgForm.value.o_phone?this.orgForm.value.o_phone:'');
      formData.append('website', this.orgForm.value.website?this.orgForm.value.website:'');
      formData.append('o_type', this.orgForm.value.o_type?this.orgForm.value.o_type:'');
      formData.append('master_feed', this.orgForm.value.master_feed);
      formData.append('master_feed_dd', this.orgForm.value.master_feed_dd);
      formData.append('master_feed_hipflat', this.orgForm.value.master_feed_hipflat);
      formData.append('active', this.orgForm.value.active);
      formData.append('o_color', this.orgForm.value.o_color?this.orgForm.value.o_color:'');
      formData.append('o_lead_auto_response', this.orgForm.value.o_lead_auto_response);
      formData.append('o_project_id', this.orgForm.value.o_project_id);
      formData.append('province', this.orgForm.value.province?this.orgForm.value.province:'');
      formData.append('district', this.orgForm.value.district?this.orgForm.value.district:'');

      this.showLoading();

      if(this.editID > 0) {
        this.orgService.update(formData, this.editID).subscribe({
          next: data => {
            this.hideLoading();
            if(data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
              this.fetchlist();
            }else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
            
          },
          error: err => {
           
            this.isSubmitted = false;
          }
        });
      }else {
        this.orgService.add(formData).subscribe({
          next: data => {
            this.hideLoading();
            if(data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
              this.fetchlist();
            }else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
            
          },
          error: err => {
           
            this.isSubmitted = false;
          }
        });
      }

      
      
    }
  }

  editRow(id:Number) {
    this.editID = id;
    this.orgService.view(id).subscribe({
      next: res => {
        let data = res.view;
        if(data) {

          if(data.province) {
            this.districts(data.province);
          }

          this.orgForm.controls.name.setValue(data.name);
          this.orgForm.controls.o_phone.setValue(data.o_phone);
          this.orgForm.controls.website.setValue(data.website);
          this.orgForm.controls.o_type.setValue(data.o_type);
          this.orgForm.controls.master_feed.setValue(data.master_feed);
          this.orgForm.controls.master_feed_dd.setValue(data.master_feed_dd);
          this.orgForm.controls.master_feed_hipflat.setValue(data.master_feed_hipflat);
          this.orgForm.controls.active.setValue(data.active);
          this.orgForm.controls.o_color.setValue(data.o_color);
          this.orgForm.controls.o_lead_auto_response.setValue(data.o_lead_auto_response);
          this.orgForm.controls.o_project_id.setValue(data.o_project_id);
          this.orgForm.controls.c_project_id.setValue(data.project);
          
          
          this.orgForm.controls.province.setValue(data.province);
          this.orgForm.controls.district.setValue(data.district);
          

          if(data.logo_image_url) {
            this.logo_image_url = data.logo_image_url;
          }
          if(data.light_logo_image_url) {
            this.light_logo_image_url = data.light_logo_image_url;
          }
          if(data.dark_logo_image_url) {
            this.dark_logo_image_url = data.dark_logo_image_url;
          }

          // this.modal.dismiss();
          this.isModalOpen = true;

        }
      },
      error: err => {
        this.isSubmitted = false;
      }
    });
  }



  deleteRow(id:Number) {
    this.editID = id;
    this.isModalOpenDelete = true;
  }

  confirmDelete() {
    if(this.editID) {
      this.isSubmitted = true;
      this.showLoading();
      this.orgService.delete(this.editID).subscribe({
        next: data => {
          this.hideLoading();
          if(data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.isModalOpenDelete = false;
            this.fetchlist();
          }else {
            this.showToast(data.message, 'danger');
            this.isSubmitted = false;
          }
        },
        error: err => {
          this.isSubmitted = false;
        }
      });
    }
    
  }

  closeModel() {
    this.modal.dismiss();
  }
  
  onWillDismiss(e) {
    this.isModalOpen = false;
  }

  closeModelDelete() {
    console.log('e');
    this.isModalOpenDelete = false;
  }
  onWillDismissDelete(e) {
    this.isModalOpenDelete = false;
  }

  get errorControl() {
    return this.orgForm.controls;
  }

  changeStatus(type) {

  }

  onLogoInput(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        this.orgForm.patchValue({
          logo: file
        });
    }
  }

  onLightLogoInput(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        this.orgForm.patchValue({
          light_logo: file
        });
    }
  }

  onDarkLogoInput(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        this.orgForm.patchValue({
          dark_logo: file
        });
    }
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
   pageChangeEvent(event: number){
      this.p = event;
      this.fetchlist();
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
  
  HideToast() {
    this.myToast = this.toast.dismiss();
  }

  showLoading() {
    this.myloading = this.loading.create({
      message: 'Please wait...',
      spinner: 'circles'
    }).then((loadingData) => {
      loadingData.present();
    });
  }

  hideLoading() {
    this.myloading = this.loading.dismiss();
  }

}
