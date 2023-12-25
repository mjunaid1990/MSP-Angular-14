import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LeadsService } from 'src/app/services/leads.service';
import { CommonService } from 'src/app/services/common.service'; 
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, LoadingController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.page.html',
  styleUrls: ['./lead-view.page.scss'],
})
export class LeadViewPage implements OnInit {

  viewModal: any = [];
  leadProfileRes: any = [];
  similarListingsRes: any = [];
  isLeadMenu: boolean = false;
  isProfileMenu: boolean = false;
  isNoteMenu: boolean = false;
  isNoteModalOpen: boolean = false;
  isProjectAssignModalOpen: boolean = false;
  isLeadProfileModalOpen: boolean = false;
  isLoading: boolean = true;
  new_note: any;
  edit_note: any;
  q: any = '';
  lead_projects: any = [];
  features_list: any = [];

  property_types: any = ['House', 'Condominium', 'Commercial', 'Land', 'Townhouse'];
  purposes: any = ['Reside', 'Investment', 'Business'];
  sqm_list: any = ['0-25', '26-50', '51-75', '76-100', '101-150', '151-200', '201-300', '300+'];
  beds: any = ['1', '2', '3', '4', '5+'];
  isOtherSelected: boolean = false;

  form: FormGroup;
  emailForm: FormGroup;
  projectform: FormGroup;
  leadprofileform: FormGroup;

  skeletons:any = [1];

  active_tab = 2;
  active_sidebar_tab = 2;
  files: any = [];


  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private formService: LeadsService,
    private comService: CommonService,
    public auth: AuthenticationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastController,
    private loading: LoadingController,
    private elemRef: ElementRef
  ) {
    let id: any = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ViewRow(id);
    }

    this.form = this.fb.group({
      description: ['', Validators.required],
    });
    this.emailForm = this.fb.group({
      description: ['', Validators.required],
    });
    

  }

  @HostListener('click', ['$event.target'])
  onClickOutside(targetElement) {
    const target = this.elemRef.nativeElement.querySelector('ion-icon');
    if (targetElement.tagName != target.tagName) {
      this.isNoteMenu= false;
      this.isLeadMenu = false;
      this.isProfileMenu = false;
      this.isProfileMenu = false;
    }
    
  }


  ngOnInit() {
    this.fetch_lead_project('');
  }

  selectActiveTab(id) {
    this.active_tab = id;
  }

  selectActiveSidebarTab(id) {
    this.active_sidebar_tab = id;
  }

  ViewRow(id) {
    this.fetch_project_features();
    this.formService.view(id).subscribe({
      next: response => {
        this.isLoading = false;
        
        this.viewModal = response.view;
        
        this.leadProfileRes = response.leadprofile;
        this.similarListingsRes = response.similar_listings;
        this.files = response.files;
        
      },
      error: err => {
        this.isLoading = false;
      }
    });
  }

  openLeadMenu() {
    this.isLeadMenu = !this.isLeadMenu;
  }

  openNoteMenu() {
    this.isNoteMenu = !this.isNoteMenu;
  }

  openProfileMenu() {
    this.isProfileMenu = !this.isProfileMenu;
  }

  editLeadProfile(id) {
    this.isLeadProfileModalOpen = !this.isLeadProfileModalOpen;
    
  }

  deleteLead(id) {

  }

  sentListing(id, listingid) {
    this.formService.save_listing_log(id, listingid).subscribe({
      next: response => {
        if(response.success) {
          this.showToast(response.message);
          this.ViewRow(this.viewModal.id);
        }
      },
      error: err => {

      }
    });
  }

  update_listing_sent_status(status, listingid) {
    const formData = new FormData();
    formData.append('listing_id', listingid);
    formData.append('status', status);
    this.formService.save_listing_sent_status(formData, this.viewModal.id).subscribe({
      next: response => {
        if(response.success) {
          this.showToast(response.message);
          this.ViewRow(this.viewModal.id);
        }
      },
      error: err => {

      }
    });
  }

  

  submitForm() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.showLoading();

      const formData = new FormData();
      formData.append('description', this.form.value.description);
      
      let noteid = null;
      if(this.edit_note) {
        noteid = this.edit_note.id;
      }
      let user = this.auth.getUser();
      if(user) {
        this.formService.save_note(formData, this.viewModal.id, noteid).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.ViewRow(this.viewModal.id);
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
  
          },
          error: err => {
            this.hideLoading();
            this.isSubmitted = false;
          }
        });
      }else {
        formData.append('is_customer', '1');
        formData.append('addedfrom', this.viewModal.addedfrom);
        this.comService.save_note_client(formData, this.viewModal.id, noteid).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.ViewRow(this.viewModal.id);
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
  
          },
          error: err => {
            this.hideLoading();
            this.isSubmitted = false;
          }
        });
      }
      
    }
  }

  submitEmailForm() {
    this.isSubmitted = true;
    if (!this.emailForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.showLoading();

      const formData = new FormData();
      formData.append('description', this.emailForm.value.description);
      
      let user = this.auth.getUser();
      if(user) {
        this.formService.save_email_sent_log(formData, this.viewModal.id).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.ViewRow(this.viewModal.id);
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
  
          },
          error: err => {
            this.hideLoading();
            this.isSubmitted = false;
          }
        });
      }else {
        formData.append('addedfrom', this.viewModal.addedfrom);
        this.formService.save_email_sent_log(formData, this.viewModal.id).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.ViewRow(this.viewModal.id);
            } else {
              this.showToast(data.message, 'danger');
              this.isSubmitted = false;
            }
  
          },
          error: err => {
            this.hideLoading();
            this.isSubmitted = false;
          }
        });
      }
      
    }
  }

  

  get errorControl() {
    return this.form.controls;
  }


  fetch_lead_project(q: string = '') {
    // this.comService.lead_projects(q).subscribe({
    //   next: response => {
    //     this.lead_projects = response.list;
    //   },
    //   error: err => {

    //   }
    // });
  }

  fetch_project_features() {
    // this.comService.features_lists().subscribe({
    //   next: response => {
    //     this.features_list = response.features;
    //   },
    //   error: err => {

    //   }
    // });
  }

  removeFile(i) {
    let file_ = this.files[i];
    this.files.splice(i, 1);
  }

  removeEditFile(id, leadid) {
    this.formService.delete_file(id, leadid).subscribe({
      next: data => {
        if (data.success) {
          this.files = data.files;
          this.showToast(data.message, 'success');
        }else {
          this.showToast(data.message, 'danger');
        }

      },
      error: err => {

      }
    });
  }

  onSelectFile(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }

    for (var i = 0; i < chooseFiles.length; i++) {
      this.uploadFile(chooseFiles[i]);
      // this.files.push(chooseFiles[i]);
      // this.filePreview(chooseFiles[i]);
    }

  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.formService.upload_file(formData, this.viewModal.id).subscribe({
      next: data => {
        if (data.success) {
          this.files = data.files;
        }else {
          this.showToast(data.message, 'danger');
        }
      },
      error: err => {

      }
    });
  }

  filePreview(file) {
    let index: any = this.files && this.files.length - 1;
    if (file) {
      var reader = new FileReader();
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.files[index]['image'] = e.target.result;
        this.files[index]['order'] = index;
        this.files[index]['status'] = 'new';
        this.files[index]['fid'] = '';
      }
    }
  }

  closeModel() {
    this.modal.dismiss();
  }

  closeProjectModel() {
    this.isProjectAssignModalOpen = false;
  }

  onWillDismiss(e) {
    this.isNoteModalOpen = false;
    this.isLeadProfileModalOpen = false;
    this.isLeadProfileModalOpen = false;
  }

  
  renderFeatures(features_) {
    let fe = features_.split(',');
    let html = '';
    if(fe) {
      fe.forEach(element => {
        html += '<p>'+element+'</p>'
      });
    }
    return html;
  }

  numberWithCommas(val) {
    if(val) {
      return val.replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return '';
    
  }

  getFirstLetters(str) {
    const firstLetters = str
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  
    return firstLetters;
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
