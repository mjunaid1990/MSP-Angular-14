import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import  { OrganizationsService } from 'src/app/services/organizations.service'
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  UserForm: FormGroup;
  editID:Number;
  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;

  userImagePlaceholder:any = './../../../assets/user-lead.png';

  queryParams: string;
  lists = [];
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  q:any = '';
  isModalOpen = false;
  isModalOpenDelete = false;
  organizations:any = [];
  roles:any = [];
  transfer_data_to: number;
  transfer_data_users:any = [];
  showPwd:boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UsersService,
    private orgService: OrganizationsService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
    ) { }

  ngOnInit() {
    this.userslist();
    this.orgList();
    this.rolesList();

    this.UserForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phonenumber: [''],
      password: ['', [Validators.required]],
      profile_image: [''],
      profile_image_source: [''],
      organization_id: [''],
      line_id: [''],
      role:['', [Validators.required]],
    });

  }

  userslist() {
    this.queryParams = '?page=' + this.p + '&q='+this.q;
    this.userService.list(this.queryParams).subscribe({
      next: response => {
        this.lists = response.list;
        this.total = response.total_count;
        
      },
      error: err => {
        
      }
    });
  }

  orgList() {
    this.orgService.dropdown().subscribe({
      next: response => {
        this.organizations = response.dropdown;
      },
      error: err => {
        
      }
    });
  }

  rolesList() {
    this.userService.roleslist().subscribe({
      next: response => {
        this.roles = response.dropdown;
        this.transfer_data_users = response.staff_members
      },
      error: err => {
        
      }
    });
  }

  searchUser(e) {
    this.q = e.target.value;
    this.userslist();
  }

  addUser() {
    this.isModalOpen = true;
    this.UserForm.reset();
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.UserForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      const formData = new FormData();

      if(this.UserForm.value.profile_image) {
        formData.append('profile_image', this.UserForm.value.profile_image);
      }
      
      formData.append('firstname', this.UserForm.value.firstname?this.UserForm.value.firstname:'');
      formData.append('lastname', this.UserForm.value.lastname?this.UserForm.value.lastname:'');
      formData.append('email', this.UserForm.value.email?this.UserForm.value.email:'');
      formData.append('password', this.UserForm.value.password?this.UserForm.value.password:'');
      formData.append('phonenumber', this.UserForm.value.phonenumber);
      formData.append('line_id', this.UserForm.value.line_id?this.UserForm.value.line_id:'');
      formData.append('role', this.UserForm.value.role);
      formData.append('organization_id', this.UserForm.value.organization_id);
      formData.append('email_signature', '');

      this.showLoading();

      if(this.editID > 0) {
        this.userService.update(formData, this.editID).subscribe({
          next: data => {
            this.hideLoading();
            if(data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
              this.userslist();
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
        this.userService.add(formData).subscribe({
          next: data => {
            this.hideLoading();
            if(data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modal.dismiss();
              this.userslist();
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

    

    this.userService.view(id).subscribe({
      next: res => {
        let data = res.view;
        if(data) {
        
          this.UserForm.controls.firstname.setValue(data.firstname);
          this.UserForm.controls.lastname.setValue(data.lastname);
          this.UserForm.controls.email.setValue(data.email);
          this.UserForm.controls.phonenumber.setValue(data.phonenumber);
          this.UserForm.controls.line_id.setValue(data.line_id);
          this.UserForm.controls.role.setValue(data.role);
          this.UserForm.controls.organization_id.setValue(data.organization_id);
          this.userImagePlaceholder = data.profile_image_url;
          this.modal.dismiss();
          this.isModalOpen = true;

          this.UserForm.controls['password'].setValidators([]);
          this.UserForm.controls['password'].updateValueAndValidity();


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
    if(this.editID && this.transfer_data_to) {
      this.isSubmitted = true;
      this.showLoading();
      this.userService.delete(this.editID, this.transfer_data_to).subscribe({
        next: data => {
          this.hideLoading();
          if(data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.isModalOpenDelete = false;
            this.userslist();
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
    return this.UserForm.controls;
  }

  onFileInput(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        this.UserForm.patchValue({
          profile_image: file
        });

        let prev = '';
        const reader = new FileReader();
        reader.onload = e => this.userImagePlaceholder = reader.result;

        reader.readAsDataURL(file);
    }
  }

  selectFile() {
    let element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
   pageChangeEvent(event: number){
      this.p = event;
      this.userslist();
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
