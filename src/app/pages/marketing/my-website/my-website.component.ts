import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service'; 
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, LoadingController } from '@ionic/angular';
import { OrganizationsService } from 'src/app/services/organizations.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-my-website',
  templateUrl: './my-website.component.html',
  styleUrls: ['./my-website.component.scss'],
})
export class MyWebsiteComponent implements OnInit {


  properties: any = [];
  selectedPropertyList:any = [];
  isToggleSearchBox: boolean = false;
  staffList: any = [];
  logo_image:any;
  light_logo_image:any;
  mobile_logo_image:any;
  mobile_light_logo_image:any;
  fav_icon_image:any;
  about_image:any;
  about_image_2:any;
  org_data:any;
  provinces_d:any = [];
  selectedFile: File | null = null;
  selectedFileLight: File | null = null;
  selectedFileMobile: File | null = null;
  selectedFileMobileLight: File | null = null;
  selectedFileFav: File | null = null;
  selectedFileAbout: File | null = null;
  selectedFileAbout2: File | null = null;
  projects: any = [];
  selectedProjects: any = [];

  private myToast: any;
  private myloading: any;
  form: FormGroup;
  isSubmitted:boolean = false;

  

  constructor(
    private formService: OrganizationsService,
    private comService: CommonService,
    public auth: AuthenticationService,
    private fb: FormBuilder,
    private toast: ToastController,
    private loading: LoadingController,
    private sanitizer: DomSanitizer
  ) { 

    this.form = this.fb.group({
      name: [''],
      website: ['',Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      address: [''],
      o_phone: [''],
      o_color: [''],
      o_color_dum: [''],
      whatsapp_no: [''],
      meta_fb_url: [''],
      o_line_id: [''],
      website_language: [''],
      about_us: [''],
      contact_email: [''],
      logo: [''],
      light_logo: [''],
      mobile_logo: [''],
      mobile_light_logo: [''],
      fav_icon: [''],
      about_us_title: [''],
      about_us_image: [''],
      about_us_image_2: [''],
      province: [''],
      en_meta_title: [''],
      th_meta_title: [''],
      featured_properties: [''],
      new_listing_contact: ['']
    });

  }

  @ViewChild("insideElement") insideElement;
  @HostListener('document:click', ['$event.target'])

  public onClick(targetElement) {
    const clickedInside = this.insideElement?this.insideElement.nativeElement.contains(targetElement):'';
    if (!clickedInside) {
      this.isToggleSearchBox = false;
    }
  }

  ngOnInit() {
    this.get_organization();
    this.provinces();
    this.staff();
  }

  get_organization() {
    this.comService.organization_by_user().subscribe({
      next: response => {
        this.org_data = response.view;

        this.logo_image = this.org_data.logo_image_url;
        this.light_logo_image = this.org_data.light_logo_image_url;

        this.mobile_logo_image = this.org_data.mobile_logo_image_url;
        this.mobile_light_logo_image = this.org_data.mobile_light_logo_image_url;
        
        this.fav_icon_image = this.org_data.fav_icon_image_url;
        
        this.about_image = this.org_data.about_image_url;
        this.about_image_2 = this.org_data.about_image_2_url;

        this.selectedProjects = this.org_data.featured_listings;
        
        this.form.controls.name.setValue(this.org_data.name);
        this.form.controls.address.setValue(this.org_data.address);
        this.form.controls.o_phone.setValue(this.org_data.o_phone);
        this.form.controls.o_line_id.setValue(this.org_data.o_line_id);
        this.form.controls.whatsapp_no.setValue(this.org_data.whatsapp_no);
        this.form.controls.meta_fb_url.setValue(this.org_data.meta_fb_url);
        this.form.controls.o_color.setValue(this.org_data.o_color);
        this.form.controls.o_color_dum.setValue(this.org_data.o_color);
        this.form.controls.website_language.setValue(this.org_data.website_language);
        this.form.controls.website.setValue(this.org_data.website);
        this.form.controls.about_us.setValue(this.org_data.about_us);
        this.form.controls.contact_email.setValue(this.org_data.contact_email);
        this.form.controls.about_us_title.setValue(this.org_data.about_us_title);
        this.form.controls.en_meta_title.setValue(this.org_data.en_meta_title);
        this.form.controls.th_meta_title.setValue(this.org_data.th_meta_title);
        this.form.controls.new_listing_contact.setValue(this.org_data.new_listing_contact);
        if(this.org_data.province) {
          this.form.controls.province.setValue(this.org_data.province.split(','));
        }
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

  staff() {
    this.comService.lead_members().subscribe({
      next: response => {
        this.staffList = response.list;
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

      const formData = new FormData();

      if(this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }
      if(this.selectedFileLight) {
        formData.append('light_logo', this.selectedFileLight);
      }
      if(this.selectedFileMobile) {
        formData.append('mobile_logo', this.selectedFileMobile);
      }
      if(this.selectedFileMobileLight) {
        formData.append('mobile_light_logo', this.selectedFileMobileLight);
      }
      if(this.selectedFileFav) {
        formData.append('fav_icon', this.selectedFileFav);
      }
      if(this.selectedFileAbout) {
        formData.append('about_us_image', this.selectedFileAbout);
      }
      if(this.selectedFileAbout2) {
        formData.append('about_us_header_image', this.selectedFileAbout2);
      }
      if(this.selectedProjects && this.selectedProjects.length > 0) {
        let ids = [];
        this.selectedProjects.forEach(element => {
          ids.push(element.id);
        });
        if(ids && ids.length > 0) {
          formData.append('featured_properties', ids.join(','));
        }
      }
      
      formData.append('name', this.form.value.name);
      formData.append('o_phone', this.form.value.o_phone?this.form.value.o_phone:'');
      formData.append('website', this.form.value.website?this.form.value.website:'');
      formData.append('o_color', this.form.value.o_color?this.form.value.o_color:'');
      formData.append('province', this.form.value.province?this.form.value.province.join(','):'');
      formData.append('address', this.form.value.address?this.form.value.address:'');
      formData.append('o_line_id', this.form.value.o_line_id?this.form.value.o_line_id:'');
      formData.append('whatsapp_no', this.form.value.whatsapp_no?this.form.value.whatsapp_no:'');
      formData.append('website_language', this.form.value.website_language?this.form.value.website_language:'');
      formData.append('meta_fb_url', this.form.value.meta_fb_url?this.form.value.meta_fb_url:'');
      formData.append('about_us', this.form.value.about_us?this.form.value.about_us:'');
      formData.append('about_us_title', this.form.value.about_us?this.form.value.about_us_title:'');
      formData.append('en_meta_title', this.form.value.en_meta_title?this.form.value.en_meta_title:'');
      formData.append('th_meta_title', this.form.value.th_meta_title?this.form.value.th_meta_title:'');
      formData.append('contact_email', this.form.value.contact_email?this.form.value.contact_email:'');
      formData.append('new_listing_contact', this.form.value.new_listing_contact?this.form.value.new_listing_contact:'');

      // this.showLoading();

      this.formService.update(formData, this.org_data.id).subscribe({
        next: data => {
          // this.hideLoading();
          if(data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
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

  searchProperties(event) {
    let text = event.target.value.trim().toLowerCase();
    this.comService.properties_agent_with_images(text).subscribe({
      next: response => {
        this.projects = response.list;
        this.isToggleSearchBox = true;
      },
      error: err => {
        
      }

    });

  }

  selectProp(item) {
    // console.log(item);
    // if(this.selectedProjects && this.selectedProjects.length > 0) {
    //   this.selectedProjects.forEach(element => {
    //     if(element.id != item.id) {
    //       this.selectedProjects.push(item);
    //     }
    //   });
    // }else {
      
    // }
    if(this.selectedProjects && this.selectedProjects.length > 6) {
      this.showToast('You can select max 6 listings');
      return false;
    }
    this.selectedProjects.push(item);
  }

  removeSel(i) {
    this.selectedProjects.splice(i, 1);
  }


  onSelectFile(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFile = chooseFiles[0];

    this.filePreview(chooseFiles[0]);

  }

  filePreview(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.logo_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  onSelectFileLogoLight(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileLight = chooseFiles[0];

    this.filePreviewLogoLight(chooseFiles[0]);

  }

  filePreviewLogoLight(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.light_logo_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }


  onSelectFileMobile(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileMobile = chooseFiles[0];

    this.filePreviewMobile(chooseFiles[0]);

  }

  filePreviewMobile(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.mobile_logo_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  onSelectFileMobileLight(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileMobileLight = chooseFiles[0];

    this.filePreviewMobileLight(chooseFiles[0]);

  }

  filePreviewMobileLight(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.mobile_light_logo_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  onSelectFileFav(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileFav = chooseFiles[0];

    this.filePreviewFav(chooseFiles[0]);

  }

  filePreviewFav(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.fav_icon_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  onSelectFileAboutImage(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileAbout = chooseFiles[0];

    this.filePreviewAboutImage(chooseFiles[0]);

  }

  filePreviewAboutImage(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.about_image = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  onSelectFileAboutImage2(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }
    this.selectedFileAbout2 = chooseFiles[0];

    this.filePreviewAboutImage2(chooseFiles[0]);

  }

  filePreviewAboutImage2(file) {
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        const img = e.target?.result as string;
        this.about_image_2 = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      }
    }
  }

  removeFile(id) {

  }

  updateColor(e) {
    this.form.controls.o_color.setValue(e.target.value);
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
