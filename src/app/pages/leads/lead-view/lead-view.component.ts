import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { LeadsService } from 'src/app/services/leads.service';
import { CommonService } from 'src/app/services/common.service'; 
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, LoadingController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShowingsService } from 'src/app/services/showings.service';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.component.html',
  styleUrls: ['./lead-view.component.scss'],
})
export class LeadViewComponent implements OnInit {

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
  listingSentform: FormGroup;

  skeletons:any = [1];
  active_tab = 1;
  files: any = [];
  properties: any = [];
  selectedPropertyList:any = [];
  isToggleSearchBox:boolean = false;

  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private formService: LeadsService,
    private comService: CommonService,
    private showingService: ShowingsService,
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

    this.projectform = this.fb.group({
      property_id: [''],
      project_list: ['', Validators.required],
    });

    this.listingSentform = this.fb.group({
      property_list: [''],
      property_id: [''],
    });

    this.leadprofileform = this.fb.group({

      rent_or_buy: ['', Validators.required],
      property_type: ['', Validators.required],
      price_from: [''],
      price_to: [''],
      features: [''],
      feature_text: [''],
      purpose: [''],
      no_of_bed: [''],
      sqm_range: ['']
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
      this.isToggleSearchBox = false;
    }
    
  }


  ngOnInit() {
    this.fetch_lead_project('');
    // this.fetchProperties();
  }

  selectActiveTab(id) {
    this.active_tab = id;
  }

  ViewRow(id) {
    this.fetch_project_features();
    this.formService.view(id).subscribe({
      next: response => {
        this.isLoading = false;
        
        this.viewModal = response.view;
        
        this.leadProfileRes = response.leadprofile;
        this.similarListingsRes = response.similar_listings;
        if(response.leadprofile) {
          this.leadprofileform.controls.rent_or_buy.setValue(response.leadprofile.rent_or_buy);
          this.leadprofileform.controls.property_type.setValue(response.leadprofile.property_type);
          this.leadprofileform.controls.price_from.setValue(response.leadprofile.price_from);
          this.leadprofileform.controls.price_to.setValue(response.leadprofile.price_to);

          this.leadprofileform.controls.purpose.setValue(response.leadprofile.purpose);
          this.leadprofileform.controls.sqm_range.setValue(response.leadprofile.sqm_range);

          if(response.leadprofile.no_of_bed) {
            let beds = response.leadprofile.no_of_bed.split(',');
            this.leadprofileform.controls.no_of_bed.setValue(beds);
          }
          

          this.leadprofileform.controls.feature_text.setValue(response.leadprofile.feature_text);
          if(response.leadprofile.features) {
            let fes = response.leadprofile.features.split(',');
            let fes_res = [];
            fes.forEach(element => {
              let obj = 
                {
                  name: element,
                  slug: element
                }
              
              fes_res.push(obj);
            });

            if(fes_res && fes_res.length > 0) {
              console.log(fes_res);
              this.leadprofileform.controls.features.setValue(fes_res);
            }

          }

        }else {
          if(this.viewModal.project_id) {
            this.leadprofileform.controls.rent_or_buy.setValue(this.viewModal.activity_log[0].project.prop_type);
            this.leadprofileform.controls.property_type.setValue(this.viewModal.activity_log[0].project.house_type);
          }
        }
      },
      error: err => {
        this.isLoading = false;
      }
    });
  }

  fetchProperties(q = '') {
    this.comService.properties_agent(q).subscribe({
      next: response => {
        this.properties = response.list;
      },
      error: err => {
        
      }

    });
  }

  searchProperties(event) {
    let text = event.target.value.trim().toLowerCase();
    

    this.comService.properties_agent(text).subscribe({
      next: response => {
        this.properties = response.list;
        this.isToggleSearchBox = true;
      },
      error: err => {
        
      }

    });

  }

  selectProp(item) {
    if(this.selectedPropertyList && this.selectedPropertyList.length > 0) {
      this.selectedPropertyList.forEach(element => {
        if(element.id == item.id) {
          this.showToast('Property already added!');
          return false;
        }
      });
    }
    this.listingSentform.controls.property_list.setValue('');
    this.selectedPropertyList.push(item);
    this.isToggleSearchBox = false;
  }

  removeProp(id) {
    if(this.selectedPropertyList && this.selectedPropertyList.length > 0) {
      this.selectedPropertyList.forEach((element,index)=> {
        if(element.id == id) {
          this.selectedPropertyList.splice(index,1);
        }
      });
    }
  }

  openLeadMenu() {
    this.isLeadMenu = !this.isLeadMenu;
  }

  openNoteMenu(id) {
    this.isNoteMenu = id;
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
    const formData = new FormData();
    formData.append('property_id[]', listingid);
    this.formService.save_listing_log(formData, id).subscribe({
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

  createNote(id) {
    this.isNoteModalOpen = true;
    this.isLeadMenu = false;
  }

  editNote(id) {
    this.formService.get_note_row(id).subscribe({
      next: response => {
        if(response.note) {
          this.edit_note = response.note;
          this.form.controls.description.setValue(response.note.description);
          // this.isNoteModalOpen = true;
        }
      },
      error: err => {

      }
    });
  }

  deleteNote(id) {
    this.formService.delete_note_row(id).subscribe({
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

  markAsLost(id) {

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

      this.formService.save_note(formData, this.viewModal.id, noteid).subscribe({
        next: data => {
          this.hideLoading();
          if (data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.form.reset();
            this.ViewRow(this.viewModal.id);
            // this.viewModal.activity_log[0].notes = data.new_note;
            // this.modal.dismiss();
            // this.isNoteModalOpen = false;
            // this.fetchlist();
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

  submitEmailForm() {
    this.isSubmitted = true;
    if (!this.emailForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.showLoading();

      const formData = new FormData();
      formData.append('description', this.emailForm.value.description);
      
      this.formService.save_email_sent_log(formData, this.viewModal.id).subscribe({
        next: data => {
          this.hideLoading();
          if (data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.emailForm.reset();
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

  assignProperty() {
    this.isProjectAssignModalOpen = true;
  }

  submitPropetyForm() {
    this.isSubmitted = true;
    if (!this.listingSentform.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {


      const formData = new FormData();
      if(this.selectedPropertyList && this.selectedPropertyList.length > 0) {
        this.selectedPropertyList.forEach(element => {
          formData.append('property_id[]', element.id);
        });
        
      }else {
        return false;
      }

      this.formService.save_listing_log(formData, this.viewModal.id).subscribe({
        next: data => {
          if (data.success) {
            this.isSubmitted = false;
            this.ViewRow(this.viewModal.id);
            this.selectedPropertyList = [];
          }
        },
        error: err => {
          this.hideLoading();
          this.isSubmitted = false;
        }
      });
    }
  }

  submitProjectForm() {
    this.isSubmitted = true;
    if (!this.projectform.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.showLoading();

      const formData = new FormData();
      formData.append('property_id', this.projectform.value.property_id);

      this.formService.assign_project(formData, this.viewModal.id).subscribe({
        next: data => {
          this.hideLoading();
          if (data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.ViewRow(this.viewModal.id);
            this.isProjectAssignModalOpen = false;
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

  submitLeadProfileForm() {
    this.isSubmitted = true;
    if (!this.leadprofileform.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      this.showLoading();

      const formData = new FormData();
      if(this.viewModal.project_id) {
        formData.append('project_id', this.viewModal.project_id);
      }
      formData.append('lead_id', this.viewModal.id);
      if(this.leadprofileform.value.property_type) {
        formData.append('property_type', this.leadprofileform.value.property_type);
      }
      if(this.leadprofileform.value.rent_or_buy) {
        formData.append('rent_or_buy', this.leadprofileform.value.rent_or_buy);
      }
      if(this.leadprofileform.value.no_of_bed) {
        formData.append('no_of_bed', this.leadprofileform.value.no_of_bed);
      }
      if(this.leadprofileform.value.price_from) {
        formData.append('price_from', this.leadprofileform.value.price_from);
      }
      if(this.leadprofileform.value.price_to) {
        formData.append('price_to', this.leadprofileform.value.price_to);
      }
      if(this.leadprofileform.value.sqm_range) {
        formData.append('sqm_range', this.leadprofileform.value.sqm_range);
      }
      if(this.leadprofileform.value.features) {
        let vals = [];
        this.leadprofileform.value.features.forEach(element => {
          vals.push(element.name);
        });
        formData.append('features', vals.toString());
      }
      if(this.leadprofileform.value.feature_text) {
        formData.append('feature_text', this.leadprofileform.value.feature_text);
      }
      if(this.leadprofileform.value.purpose) {
        formData.append('purpose', this.leadprofileform.value.purpose);
      }

      this.formService.save_lead_profile(formData, this.viewModal.id).subscribe({
        next: data => {
          this.hideLoading();
          if (data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.isLeadProfileModalOpen = false;
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

  get errorControl() {
    return this.form.controls;
  }

  get projectControl() {
    return this.projectform.controls;
  }

  get leadprofileControl() {
    return this.leadprofileform.controls;
  }

  fetch_lead_project(q: string = '') {
    this.comService.lead_projects(q).subscribe({
      next: response => {
        this.lead_projects = response.list;
      },
      error: err => {

      }
    });
  }

  fetch_project_features() {
    this.comService.features_lists().subscribe({
      next: response => {
        this.features_list = response.features;
      },
      error: err => {

      }
    });
  }

  update_showing_status(id, status) {
    this.showingService.change_event_status(id, status).subscribe({
      next: res => {
        if (res.success) {
          this.showToast(res.message);
          this.ViewRow(this.viewModal.id);
        } else {
          this.showToast(res.message, 'danger');
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  searchLeadProjects(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.lead_projects;
      event.component.endSearch();
      return;
    }

    this.comService.lead_projects(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  leadProjectsChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.projectform.controls.property_id.setValue(event.value.id);
  }

  

  leadFeaturesChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.isOtherSelected = false;
    let fes = event.value;
    fes.forEach(element => {
      if(element.name == 'Other') {
        this.isOtherSelected = true;
      }
    });
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

  closeLeadProfileModel() {
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
