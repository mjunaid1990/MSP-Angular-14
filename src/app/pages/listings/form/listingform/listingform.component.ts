import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { CalendarComponentOptions, CalendarResult } from 'ion2-calendar';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ListingService } from 'src/app/services/listing.service'
import { IonModal } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DatePipe } from '@angular/common';
import { Options } from 'sortablejs';
import { IonSelect } from '@ionic/angular';
import { NgxNumToWordsService } from 'ngx-num-to-words';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-listingform',
  templateUrl: './listingform.component.html',
  styleUrls: ['./listingform.component.scss'],
  providers: [DatePipe]
})
export class ListingformComponent implements OnInit {

  @ViewChild('clentComponent') clientComponent: IonicSelectableComponent;
  @ViewChild('memberComponent') memberComponent: IonicSelectableComponent;
  @ViewChild('content') content: IonContent;

  options: Options = {
    draggable: '.draggable'
  };

  date: any;
  formDate: any = new Date();
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };

  step = 1;
  title_tab = 'en';
  desc_tab = 'en';

  ports: any = {};
  port: any;
  markers = [];

  files: File[] = [];
  filesPreview: any = [];
  galleries: any = [];

  floorFiles: File[] = [];



  form: FormGroup;
  editID: Number = null;
  viewModal:any = [];
  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild('featurebox') featurebox: IonSelect;

  userImagePlaceholder: any = './../../../assets/placeholder-image.jpg';
  propImagePlaceholder: any = './../../../assets/placeimg.webp';

  imgSvgPlaceholder = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="ic-photoLibrary"><path d="M20 4V16H8V4H20ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM11.5 11.67L13.19 13.93L15.67 10.83L19 15H9L11.5 11.67ZM2 6V20C2 21.1 2.9 22 4 22H18V20H4V6H2Z" fill="currentColor"></path></svg>';

  queryParams: string;
  lists = [];
  slist: any;
  p: number = 1;
  limit: number = 10;
  total: number = 0;
  q: any = '';
  isModalOpen = false;
  isFormModalOpen = false;
  isModalOpenDelete = false;

  isPopoverOpen = false;

  property_types_arr: any = ['House', 'Condominium', 'Land', 'Townhouse', 'Commercial'];
  is_property_type_clicked = false;
  listing_types_arr: any = ['buy', 'rent', 'Rent, Buy'];
  furnishing_arr: any = ['Fully', 'Partly', 'Not furnished'];
  listing_sources_types: any = ['Co-agent Listing', 'Owner'];
  statuses: any = [];
  buildings: any = [];
  provinces: any = [];
  districts: any = [];
  district_cities: any = [];
  stations: any = [];
  features: any = [];
  selected_features: any = [];
  members: any = [];
  contacts: any = [];
  bed_int: number = 0;
  bath_int: number = 0;
  step_one_required_fields = [];
  step_two_required_fields = [];
  step_four_required_fields = [];
  is_save_as_draft_enabled = false;
  thai_input = false;
  thai_description = false;
  default_user: any = [];
  uploadedFiles: any = [];
  featured_image: any;
  main_images_list: any = [];
  disableMember:any = [];
  selectedMembers:any = [];
  isOpenActionMenu:boolean = false;
  yearslist:any = [];
  landmark:any;
  is_floor_plan = false;

  editstatuses: any = [
    { id: '0', name: 'Draft' },
    { id: '2', name: 'Active' },
    { id: '3', name: 'In Negotiation' },
    { id: '4', name: 'Sold/Rented' },
    { id: '5', name: 'Expired/Unsold' },
  ];


  googleOptions = {
    zoom: 14,
    center: new google.maps.LatLng(13.7563, 100.5018),
    mapTypeControl: true,
    mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
    navigationControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private formService: ListingService,
    private comService: CommonService,
    private auth: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastController,
    private loading: LoadingController,
    private datePipe: DatePipe,
    private ngxNumToWordsService: NgxNumToWordsService,
    private titleCase: TitleCasePipe
  ) {
    this.formDate = this.datePipe.transform(this.formDate, 'yyyy-MM-dd');
    let id: any = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editRow(id);
    }
  }


  ngOnInit() {
    this.province_list();
    this.features_and_stations_list();
    this.contactsList('');
    this.members_list('');
    this.fetch_buildings('');
    this.yearslist = this.generateArrayOfYears();

    this.selectedMembers.push(this.auth.getUser());
    let default_member = this.auth.getUser().firstname;
    if (this.auth.getUser().lastname) {
      default_member += ' ' + this.auth.getUser().lastname;
    }
    this.default_user.push({
      staffid: this.auth.getUser().id,
      name: default_member,
    })

    this.disableMember = this.default_user;

    let random = Math.floor(Math.random() * (9999999 - 1000000)) + 100000;

    this.form = this.fb.group({
      house_type: ['', [Validators.required]],
      listing_type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      name_th: [''],
      ref_id: [''],
      sale_price: [''],
      rent_price: [''],
      building: [''],
      building_id: [''],
      status: [2],
      project_member_ids: [this.default_user],
      project_members: [''],
      start_date: [this.formDate],
      address: [''],
      province_id: [''],
      district_id: [''],
      district_city_id: [''],
      province: [''],
      district: [''],
      district_city: [''],
      station: [''],
      beds: [''],
      baths: [''],
      sqm: [''],
      area: [''],
      floor: [''],
      floors: [''],
      rai: [''],
      ngan: [''],
      wah: [''],
      furnishing: [''],
      additional_features: [''],
      youtube_link: [''],
      description: [''],
      description_th: [''],
      lat: [''],
      lng: [''],
      clientid: [''],
      listing_source_type: [''],
      year_built: [''],
      contact_info: new FormGroup({
        firstname: new FormControl(''),
        lastname: new FormControl(''),
        email: new FormControl('', [Validators.email]),
        phone: new FormControl(''),
        line_id: new FormControl(''),
        agency: new FormControl(''),
      }),
      contact_id: [''],
      random_string: [random]
    });

    this.step_one_required_fields = [
      'house_type',
      'listing_type',
      'name'
    ];
  }



  
  
  members_list(q: string = '') {
    this.comService.lead_members(q).subscribe({
      next: response => {
        this.members = response.list;
        // this.form.controls.project_member_ids.setValue(this.auth.getUser());
      },
      error: err => {

      }
    });
  }

  searchMembers(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.members;
      event.component.endSearch();
      return;
    }

    this.comService.lead_members(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  changeMembers(e) {
    this.selectedMembers = [];
    this.selectedMembers.push(this.auth.getUser());
    this.form.value.project_member_ids.forEach((item, index)=>{
      if(index > 0) {
        this.selectedMembers.push(item);
      }
    })
  }

  openMemberBox() {
    let opened = this.memberComponent.isOpened;
    if (!opened) {
      this.memberComponent.open();
    }
  }

  fetch_buildings(q: string = '') {
    this.comService.buildings(q).subscribe({
      next: response => {
        this.buildings = response.list;
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

      event.component.items = this.buildings;
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

  buildingsChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.form.controls.building_id.setValue(event.value.id);
  }

  contactsList(q: string = '') {
    this.comService.user_contacts(q).subscribe({
      next: response => {
        this.contacts = response.list;
      },
      error: err => {

      }
    });
  }

  searchContacts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    if (!text) {
      // Close any running subscription.

      event.component.items = this.contacts;
      event.component.endSearch();
      return;
    }

    this.comService.user_contacts(text).subscribe({
      next: response => {
        event.component.items = response.list;
        event.component.endSearch();
      },
      error: err => {
        event.component.endSearch();
      }

    });

  }

  contactChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.form.controls.clientid.setValue(event.value.id);
    this.form.get('contact_info.firstname').setValue(event.value.firstname);
    this.form.get('contact_info.lastname').setValue(event.value.lastname);
    this.form.get('contact_info.email').setValue(event.value.email);
    this.form.get('contact_info.phone').setValue(event.value.phone);
  }

  province_list() {
    this.comService.provinces().subscribe({
      next: response => {
        this.provinces = response.list;
      },
      error: err => {

      }
    });
  }

  districts_list(e) {
    this.comService.districts(e.target.value).subscribe({
      next: response => {
        this.districts = response.list;
      },
      error: err => {

      }
    });

  }

  districts_list_edit(e, $id) {
    this.comService.districts(e).subscribe({
      next: response => {
        this.districts = response.list;
        this.form.controls.district.setValue($id);
      },
      error: err => {

      }
    });

  }

  district_cities_list(e) {
    this.comService.districts_cities(e.target.value).subscribe({
      next: response => {
        this.district_cities = response.list;
        this.fetchLandmarks(e.target.value);
      },
      error: err => {

      }
    });

  }

  district_cities_list_edit(e, $id) {
    this.comService.districts_cities(e).subscribe({
      next: response => {
        this.district_cities = response.list;
        this.form.controls.district_city.setValue($id);
      },
      error: err => {

      }
    });

  }

  features_and_stations_list() {
    this.comService.features_and_stations().subscribe({
      next: response => {
        this.stations = response.stations;
        this.features = response.features;
      },
      error: err => {

      }
    });
  }

  fetchLandmarks(q) {
    this.comService.landmark_row(q).subscribe({
      next: response => {
        this.landmark = response.landmark
      },
      error: err => {

      }
    });
  }

  eventHandler(event: any, name: string) {
    // Add marker on double click event
    this.dropMarker(event)
  }

  dropMarker(event: any) {
    this.markers = [];
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      options: {
        animation: google.maps.Animation.DROP,
      },
    })

    this.form.controls.lat.setValue(event.latLng.lat());
    this.form.controls.lng.setValue(event.latLng.lng());

  }

  onSelectFile(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }

    for (var i = 0; i < chooseFiles.length; i++) {
      this.files.push(chooseFiles[i]);
      this.filePreview(chooseFiles[i]);
    }

  }

  onSelectFloorFile(chooseFiles: FileList) {

    if (chooseFiles.length === 0) {
      return;
    }

    if (chooseFiles.length > 3) {
      alert('You can upload 3 files max!');
      return;
    }

    for (var i = 0; i < chooseFiles.length; i++) {
      this.floorFiles.push(chooseFiles[i]);
      this.fileFloorPreview(chooseFiles[i]);
    }

  }


  isDraggable($val) {
    return $val;
  }

  filePreview(file) {
    let index: any = this.files && this.files.length - 1;
    if (file) {
      var reader = new FileReader();
      let src = URL.createObjectURL(file);

      this.convertImageToWebp(src, index);
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.files[index]['image'] = e.target.result;
        this.files[index]['order'] = index;
        this.files[index]['status'] = 'new';
        this.files[index]['fid'] = '';
      }
    }
  }

  fileFloorPreview(file) {
    let index: any = this.floorFiles && this.floorFiles.length - 1;
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.floorFiles[index]['image'] = e.target.result;
        this.floorFiles[index]['status'] = 'new';
        this.floorFiles[index]['fid'] = '';
      }
    }
  }


  convertImageToWebp(img, index) {
    let myImage = new Image();
    myImage.src = img;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    let url = '';
    myImage.onload = function () {
      canvas.width = myImage.width;
      canvas.height = myImage.height;
      ctx.drawImage(myImage, 0, 0);
      url = canvas.toDataURL("image/webp", 1);
    }
    setTimeout(() => {
      this.files[index]['image'] = url;
    }, 1000);


  }


  removeFile(i) {
    let file_ = this.files[i];
    if(file_['fid'] != '') {
      this.removeEditFile(i, file_['fid'])
    }else {
      this.files.splice(i, 1);
    }
  }

  removeEditFile(index, id) {
    this.formService.delete_file(id).subscribe({
      next: data => {
        if (data.success) {
          this.files.splice(index, 1);
          this.showToast(data.message, 'success');
        }else {
          this.showToast(data.message, 'danger');
        }

      },
      error: err => {

      }
    });
  }

  setFeatured(i) {
    this.files.forEach(el => {
      el['featured'] = false;
    });
    this.files[i]['featured'] = true;
    this.featured_image = this.files[i];
  }

  removeFloorFile(i) {
    let file_ = this.floorFiles[i];
    if(file_['fid'] != '') {
      this.removeFloorEditFile(i, file_['fid'])
    }else {
      this.floorFiles.splice(i, 1);
    }
  }

  removeFloorEditFile(index, id) {
    this.formService.delete_floor_file(id).subscribe({
      next: data => {
        if (data.success) {
          this.floorFiles.splice(index, 1);
          this.showToast(data.message, 'success');
        }else {
          this.showToast(data.message, 'danger');
        }

      },
      error: err => {

      }
    });
  }


  update_images() {
    this.main_images_list = this.files;
    if (this.main_images_list) {
      this.main_images_list.forEach((element, index) => {
        if(element['featured'] === true) {

          this.main_images_list.unshift(this.main_images_list.splice(index, 1)[0]);
          
        }
      });
      console.log(this.main_images_list);
    }
  }

  arrayMove(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  fetch_files() {
    this.formService.files_list(this.form.controls.random_string.value).subscribe({
      next: response => {
        if (response.files) {
          this.uploadedFiles = response.files;
        }

      },
      error: err => {

      }
    });
  }

  


  async closeModel() {
    await this.modalController.dismiss();
  }


  save_draft() {

    this.form.controls.beds.removeValidators(Validators.required);
    this.form.controls.baths.removeValidators(Validators.required);
    this.form.controls.sqm.removeValidators(Validators.required);
    this.form.controls.area.removeValidators(Validators.required);
    this.form.controls.floor.removeValidators(Validators.required);
    this.form.controls.rai.removeValidators(Validators.required);
    this.form.controls.ngan.removeValidators(Validators.required);
    this.form.controls.wah.removeValidators(Validators.required);
    this.form.controls.province.removeValidators(Validators.required);
    this.form.controls.district.removeValidators(Validators.required);

    this.form.controls.rent_price.removeValidators(Validators.required);
    this.form.controls.sale_price.removeValidators(Validators.required);

    this.form.controls.rent_price.updateValueAndValidity();
    this.form.controls.sale_price.updateValueAndValidity();

    this.form.controls.beds.updateValueAndValidity();
    this.form.controls.baths.updateValueAndValidity();
    this.form.controls.sqm.updateValueAndValidity();
    this.form.controls.area.updateValueAndValidity();
    this.form.controls.floor.updateValueAndValidity();
    this.form.controls.rai.updateValueAndValidity();
    this.form.controls.ngan.updateValueAndValidity();
    this.form.controls.wah.updateValueAndValidity();
    this.form.controls.province.updateValueAndValidity();
    this.form.controls.district.updateValueAndValidity();

    this.form.controls.status.setValue(1);
    this.submitForm();
  }

  submitForm() {
    this.isSubmitted = true;
    this.isOpenActionMenu = false;
    console.log(this.form);
    if (!this.form.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {

      const formData = new FormData();

      formData.append('custom_fields[projects][6]', this.form.value.house_type);
      formData.append('custom_fields[projects][5]', this.form.value.listing_type);
      if (this.form.value.name_th) {
        formData.append('custom_fields[projects][36]', this.form.value.name_th);
      }
      if (this.form.value.sale_price) {
        formData.append('custom_fields[projects][14]', this.removeComma(this.form.value.sale_price));
      }
      if (this.form.value.rent_price) {
        formData.append('custom_fields[projects][13]', this.removeComma(this.form.value.rent_price));
      }
      if (this.form.value.beds) {
        formData.append('custom_fields[projects][1]', this.form.value.beds);
      }
      if (this.form.value.baths) {
        formData.append('custom_fields[projects][2]', this.form.value.baths);
      }
      if (this.form.value.sqm) {
        formData.append('custom_fields[projects][3]', this.form.value.sqm);
      }
      if (this.form.value.area) {
        formData.append('custom_fields[projects][41]', this.form.value.area);
      }
      if (this.form.value.floors) {
        formData.append('custom_fields[projects][40]', this.form.value.floors);
      }
      if (this.form.value.floor) {
        formData.append('custom_fields[projects][39]', this.form.value.floor);
      }
      if (this.form.value.rai) {
        formData.append('custom_fields[projects][31]', this.form.value.rai);
      }
      if (this.form.value.ngan) {
        formData.append('custom_fields[projects][32]', this.form.value.ngan);
      }
      if (this.form.value.wah) {
        formData.append('custom_fields[projects][33]', this.form.value.wah);
      }

      if (this.form.value.year_built) {
        formData.append('custom_fields[projects][55]', this.form.value.year_built);
      }
      formData.append('name', this.form.value.name);
      formData.append('status', this.form.value.status);
      if (this.form.value.description) {
        formData.append('description', this.form.value.description);
      }
      if (this.form.value.description_th) {
        formData.append('custom_fields[projects][37]', this.form.value.description_th);
      }
      if (this.form.value.lat) {
        formData.append('custom_fields[projects][10]', this.form.value.lat);
      }
      if (this.form.value.lng) {
        formData.append('custom_fields[projects][11]', this.form.value.lng);
      }
      if (this.form.value.address) {
        formData.append('custom_fields[projects][12]', this.form.value.address);
      }
      if (this.form.value.ref_id) {
        formData.append('custom_fields[projects][48]', this.form.value.ref_id);
      }
      if (this.form.value.furnishing) {
        formData.append('custom_fields[projects][54]', this.form.value.furnishing);
      }
      if (this.form.value.building_id) {
        formData.append('building_id', this.form.value.building_id);
      }
      if (this.form.value.province) {
        formData.append('province', this.form.value.province);
      }
      if (this.form.value.district) {
        formData.append('district', this.form.value.district);
      }
      if (this.form.value.district_city == undefined) {
        formData.append('district_city', '');
      } else {
        formData.append('district_city', this.form.value.district_city);
      }
      if (this.form.value.station) {
        formData.append('custom_fields[projects][15]', this.form.value.station);
      }
      if (this.form.value.youtube_link) {
        formData.append('youtube_link', this.form.value.youtube_link);
      }
      if (this.form.value.listing_source_type) {
        formData.append('listing_source_type', this.form.value.listing_source_type);
      }
      if (this.form.value.clientid) {
        formData.append('clientid', this.form.value.clientid);
      }

      formData.append('start_date', this.form.value.start_date);
      

      formData.append('contact[firstname]', '');
      formData.append('contact[lastname]', '');
      formData.append('contact[email]', '');
      formData.append('contact[phone]', '');
      formData.append('contact[line_id]', '');
      if (this.form.get('contact_info').value.firstname) {
        let contact_name = this.parseName(this.form.get('contact_info').value.firstname);
        console.log(contact_name);
        if(contact_name.firstName) {
          formData.append('contact[firstname]', contact_name.firstName);
        }
        if(contact_name.lastName) {
          formData.append('contact[lastname]', contact_name.lastName);
        }
      }
      if (this.form.get('contact_info').value.email) {
        formData.append('contact[email]', this.form.get('contact_info').value.email);
      }
      if (this.form.get('contact_info').value.phone) {
        formData.append('contact[phone]', this.form.get('contact_info').value.phone);
      }
      if (this.form.get('contact_info').value.line_id) {
        formData.append('contact[line_id]', this.form.get('contact_info').value.line_id);
      }
      if (this.form.get('contact_info').value.agency) {
        formData.append('contact[company_name]', this.form.get('contact_info').value.agency);
      }
      let d = this.form.value.project_member_ids.filter(item => item.staffid !== this.auth.getUser().id);
      formData.append('project_members[]', this.auth.getUser().id);
      
      if(d && d.length > 0) {
        d.forEach(element => {
          formData.append('project_members[]', element.staffid);
        });
      }
      
      
      if(this.form.value.additional_features) {
        this.form.value.additional_features.forEach(element => {
          formData.append('custom_fields[projects][9][]', element);
        });
      }
      

      this.files.forEach((el, index) => {
        formData.append('file['+index+'][image]', el['image']);
        formData.append('file['+index+'][featured]', el['featured']);
        formData.append('file['+index+'][order]', el['order']);
        formData.append('file['+index+'][status]', el['status']);
        formData.append('file['+index+'][fid]', el['fid']);
      });

      if(this.floorFiles && this.floorFiles.length > 0) {
        this.is_floor_plan = true;
        this.floorFiles.forEach((el, index) => {
          formData.append('floorfile['+index+'][image]', el['image']);
          formData.append('floorfile['+index+'][status]', el['status']);
        });
      }

      this.showLoading();

      if (this.editID) {
        this.formService.update(formData, this.editID).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
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
      } else {
        this.formService.add(formData).subscribe({
          next: data => {
            this.hideLoading();
            if (data.success) {
              this.showToast(data.message);
              this.isSubmitted = false;
              this.modalController.dismiss();
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

  editRow(id: Number) {
    this.editID = id;

    this.formService.view(id).subscribe({
      next: res => {
        let listing: any = res.listing;
        this.viewModal = res.listing;
        if(this.viewModal.status == '1') {
          this.viewModal.status = '0';
        }
        if (listing) {
          this.form.controls.name.setValue(listing.name);
          this.form.controls.house_type.setValue(listing.house_type);

          if (listing.prop_type == 'Rent') {
            listing.prop_type = 'rent';
            
          } else if (listing.prop_type == 'Sale') {
            listing.prop_type = 'buy';
            
          } else if (listing.prop_type == 'Rent, Sale') {
            listing.prop_type = 'Rent, Buy';
            
          }

          this.form.controls.listing_type.setValue(listing.prop_type);
          this.form.controls.name_th.setValue(listing.name_th);
          this.form.controls.sale_price.setValue(listing.sale_price);
          this.form.controls.rent_price.setValue(listing.rent_price);

          this.form.controls.beds.setValue(listing.bed);

          this.form.controls.baths.setValue(listing.bath);
          this.form.controls.sqm.setValue(listing.sqm);
          this.form.controls.area.setValue(listing.area);
          this.form.controls.floors.setValue(listing.floors);
          this.form.controls.floor.setValue(listing.floor);
          this.form.controls.ref_id.setValue(listing.ref_id);
          this.form.controls.furnishing.setValue(listing.furnishing);
          this.form.controls.year_built.setValue(listing.year_built);
          // this.form.controls.rai.setValue(listing.rai);
          // this.form.controls.ngan.setValue(listing.ngan);
          // this.form.controls.wah.setValue(listing.wah);
          let $html = listing.description;
          $html = $html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
          $html = $html.replace('<br>', '\n');
          this.form.controls.description.setValue($html);

          let $html_th = listing.description_th;
          $html_th = $html_th.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
          $html_th = $html_th.replace('<br>', '\n');
          this.form.controls.description_th.setValue($html_th);

          this.form.controls.lat.setValue(listing.lat);
          this.form.controls.lng.setValue(listing.lng);

          if (listing.lat && listing.lng) {

            let marker = new google.maps.Marker({
              position: { lat: Number(listing.lat), lng: Number(listing.lng) }
            });

            this.markers.push(marker);
          }

          this.form.controls.address.setValue(listing.address);
          if (listing.building) {
            this.form.controls.building.setValue(listing.building);
            this.form.controls.building_id.setValue(listing.building.id);
            let interval_building;
            interval_building = setInterval(() => {
              if (this.buildings && this.buildings.length > 0) {
                let found = this.checkIfBuildingsExists(listing.building.id);
                if (!found) {
                  this.buildings.push(listing.building);
                }
                clearInterval(interval_building);
              }
            }, 2000);
          }
          this.form.controls.province.setValue(listing.province);


          if (listing.district) {
            this.districts_list_edit(listing.province, listing.district);

          }

          if (listing.district_city) {
            this.district_cities_list_edit(listing.district, listing.district_city);

          }
          if (listing.station) {
            this.form.controls.station.setValue(listing.station);
          }

          this.form.controls.youtube_link.setValue(listing.youtube_link);
          this.form.controls.start_date.setValue(listing.start_date);
          this.form.controls.status.setValue(listing.status);
          this.form.controls.listing_source_type.setValue(listing.listing_source_type);
          if (listing.contact_info) {
            this.form.controls.clientid.setValue(listing.contact_info.id);
            let contact_name = '';
            if(listing.contact_info.firstname != '') {
              contact_name = listing.contact_info.firstname;
            }
            if(listing.contact_info.lastname != '') {
              contact_name += ' '+listing.contact_info.lastname;
            }
            this.form.get('contact_info.firstname').setValue(contact_name);
            this.form.get('contact_info.email').setValue(listing.contact_info.email);
            this.form.get('contact_info.phone').setValue(listing.contact_info.phonenumber);
            this.form.get('contact_info.line_id').setValue(listing.contact_info.line_id);
            this.form.get('contact_info.agency').setValue(listing.contact_info.company_name);
          }

          this.form.controls.project_member_ids.setValue(listing.project_members);
          if(listing.project_members) {
            this.selectedMembers = listing.project_members;
            this.disableMember = this.default_user;
          }

          if (listing.project_members) {
            let interval;
            interval = setInterval(() => {
              if (this.members && this.members.length > 0) {
                listing.project_members.forEach(element => {
                  let exist = this.checkIfMemberExists(element.staffid);
                  if (!exist) {
                    this.members.push(element);
                    
                  }
                });
                clearInterval(interval);
              }
            }, 2000);


          }

          if (listing.features) {
            
            let fe = [];
            listing.features.forEach(element => {
              this.setAdditionalProp(element.trim());
              fe.push(element.trim());
            });
            this.form.controls.additional_features.setValue(fe);
          }


          if (listing.gallery && listing.gallery.length > 0) {
            listing.gallery.forEach(element => {
              this.files.push(element);
            });
            this.update_images();
          }

          if (listing.floorplans && listing.floorplans.length > 0) {
            listing.floorplans.forEach(element => {
              this.floorFiles.push(element);
            });
          }

          this.is_save_as_draft_enabled = true;
        }
      },
      error: err => {
        this.isSubmitted = false;
      }
    });
  }

  feslug(val) {
    let v = val.replace(' ', '-');
    return v.replace('24', '');
  }

  checkIfMemberExists($id: string) {
    let valid = false;
    this.members.forEach(element => {
      if (element.staffid == $id) {
        valid = true;
      }
    });
    return valid;
  }

  checkIfBuildingsExists($id: string) {
    let valid = false;
    this.buildings.forEach(element => {
      if (element.id == $id) {
        valid = true;
      }
    });
    return valid;
  }

  onWillDismiss(e) {
    this.isModalOpen = false;
    this.isFormModalOpen = false;
  }

  closeModelDelete() {
    console.log('e');
    this.isModalOpenDelete = false;
  }
  onWillDismissDelete(e) {
    this.isModalOpenDelete = false;
  }

  get errorControl() {
    return this.form.controls;
  }
  get errorControlContact() {
    return this.form.get('contact_info');
  }

  parseName(input) {
    const [firstName, ...lastName] = input.split(' ').filter(Boolean);
    return {
      firstName: firstName,
      lastName: lastName.join(' ')
    }
  }

  update_step_one_required_fields(val) {
    this.step_one_required_fields.forEach((element, index) => {
      if (element == val) this.step_one_required_fields.splice(index, 1);
    });
  }

  update_step_two_required_fields(val) {
    this.step_two_required_fields.forEach((element, index) => {
      if (element == val) this.step_two_required_fields.splice(index, 1);
    });
  }

  update_step_four_required_fields(val) {
    this.step_four_required_fields.forEach((element, index) => {
      if (element == val) this.step_four_required_fields.splice(index, 1);
    });
  }

  setListingType(e) {
    let val = e.target.value;
    this.form.controls.listing_type.setValue(val);

    this.enableSaveAsDraftButton();

    this.form.controls.rent_price.removeValidators(Validators.required);
    this.form.controls.sale_price.removeValidators(Validators.required);

    this.form.controls.rent_price.updateValueAndValidity();
    this.form.controls.sale_price.updateValueAndValidity();

    this.update_step_one_required_fields('sale_price');
    this.update_step_one_required_fields('rent_price');

    if (val == 'buy') {
      this.form.get('sale_price').setValidators(Validators.required);
      this.form.controls.sale_price.updateValueAndValidity();
      this.step_one_required_fields.push('sale_price');
      // this.form.controls.rent_price.setValue('');
    } else if (val == 'rent') {
      this.form.controls.rent_price.setValidators(Validators.required);
      this.form.controls.rent_price.updateValueAndValidity();
      this.step_one_required_fields.push('rent_price');
      // this.form.controls.sale_price.setValue('');
    } else if (val == 'Rent, Buy') {
      this.form.controls.rent_price.setValidators(Validators.required);
      this.form.controls.sale_price.setValidators(Validators.required);
      this.form.controls.rent_price.updateValueAndValidity();
      this.form.controls.sale_price.updateValueAndValidity();
      this.step_one_required_fields.push('sale_price');
      this.step_one_required_fields.push('rent_price');
    }

  }

  setHouseType(e) {
    this.is_property_type_clicked = false;
    let val = e;
    this.form.controls.house_type.setValue(val);

    this.enableSaveAsDraftButton();

    this.form.controls.beds.removeValidators(Validators.required);
    this.form.controls.baths.removeValidators(Validators.required);
    this.form.controls.sqm.removeValidators(Validators.required);
    this.form.controls.area.removeValidators(Validators.required);
    this.form.controls.floor.removeValidators(Validators.required);
    this.form.controls.province.removeValidators(Validators.required);
    this.form.controls.district.removeValidators(Validators.required);

    this.form.controls.beds.updateValueAndValidity();
    this.form.controls.baths.updateValueAndValidity();
    this.form.controls.sqm.updateValueAndValidity();
    this.form.controls.area.updateValueAndValidity();
    this.form.controls.floor.updateValueAndValidity();
    this.form.controls.province.updateValueAndValidity();
    this.form.controls.district.updateValueAndValidity();


    this.update_step_one_required_fields('beds');
    this.update_step_one_required_fields('baths');
    this.update_step_one_required_fields('sqm');
    this.update_step_one_required_fields('area');
    this.update_step_one_required_fields('floor');
    this.update_step_two_required_fields('province');
    this.update_step_two_required_fields('district');


    if (val == 'House') {
      this.form.controls.beds.setValidators(Validators.required);
      this.form.controls.beds.updateValueAndValidity();
      this.step_one_required_fields.push('beds');

      this.form.controls.baths.setValidators(Validators.required);
      this.form.controls.baths.updateValueAndValidity();
      this.step_one_required_fields.push('baths');

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();
      this.step_one_required_fields.push('area');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');

    }else if (val == 'Villa') {
      this.form.controls.beds.setValidators(Validators.required);
      this.form.controls.beds.updateValueAndValidity();
      this.step_one_required_fields.push('beds');

      this.form.controls.baths.setValidators(Validators.required);
      this.form.controls.baths.updateValueAndValidity();
      this.step_one_required_fields.push('baths');

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();
      this.step_one_required_fields.push('area');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');

    } else if (val == 'Condominium') {
      this.form.controls.beds.setValidators(Validators.required);
      this.form.controls.beds.updateValueAndValidity();
      this.step_one_required_fields.push('beds');

      this.form.controls.baths.setValidators(Validators.required);
      this.form.controls.baths.updateValueAndValidity();
      this.step_one_required_fields.push('baths');

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Commercial') {
      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Land') {
      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Townhouse') {
      this.form.controls.beds.setValidators(Validators.required);
      this.form.controls.beds.updateValueAndValidity();
      this.step_one_required_fields.push('beds');

      this.form.controls.baths.setValidators(Validators.required);
      this.form.controls.baths.updateValueAndValidity();
      this.step_one_required_fields.push('baths');

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();
      this.step_one_required_fields.push('area');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Office') {

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Business') {

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Warehouse/Factory') {

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();
      this.step_one_required_fields.push('area');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Retail') {

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    } else if (val == 'Hotel') {

      this.form.controls.beds.setValidators(Validators.required);
      this.form.controls.beds.updateValueAndValidity();
      this.step_one_required_fields.push('beds');

      this.form.controls.baths.setValidators(Validators.required);
      this.form.controls.baths.updateValueAndValidity();
      this.step_one_required_fields.push('baths');

      this.form.controls.sqm.setValidators(Validators.required);
      this.form.controls.sqm.updateValueAndValidity();
      this.step_one_required_fields.push('sqm');

      this.form.controls.area.setValidators(Validators.required);
      this.form.controls.area.updateValueAndValidity();
      this.step_one_required_fields.push('area');

      this.form.controls.province.setValidators(Validators.required);
      this.form.controls.province.updateValueAndValidity();
      this.step_two_required_fields.push('province');

      this.form.controls.district.setValidators(Validators.required);
      this.form.controls.district.updateValueAndValidity();
      this.step_two_required_fields.push('district');
    }
  }

  enableSaveAsDraftButton() {
    this.is_save_as_draft_enabled = false;
    if (this.form.value.house_type && this.form.value.listing_type && this.form.value.name) {
      this.is_save_as_draft_enabled = true;
    }
  }

  setName() {
    this.enableSaveAsDraftButton();
  }

  inputCountPlus(type) {
    if (type == 'beds') {
      this.bed_int++;
      this.form.controls.beds.setValue(this.bed_int);
    } else if (type == 'baths') {
      this.bath_int++;
      this.form.controls.baths.setValue(this.bath_int);
    }
  }

  inputCountMinus(type) {
    if (type == 'beds') {
      if (this.bed_int > 0) {
        this.bed_int--;
      }
      this.form.controls.beds.setValue(this.bed_int);
    } else if (type == 'baths') {
      if (this.bath_int > 0) {
        this.bath_int--;
      }
      this.form.controls.baths.setValue(this.bath_int);
    }
  }

  changeAdditionalProp(name, slug) {
    if (this.selected_features.includes(name)) {
      return slug.replace('24','') + '-select';
    } else {
      return slug;
    }
  }

  setAdditionalProp(v) {
    if (this.selected_features.includes(v)) {
      this.selected_features.splice(this.selected_features.indexOf(v), 1);
    } else {
      this.selected_features.push(v);
    }
  }

  openClientSearch() {
    let opened = this.clientComponent.isOpened;
    if (!opened) {
      this.clientComponent.open();
    }

  }

  open_popover_modal() {
    this.isPopoverOpen = true;
  }

  popupFeatuers() {
    this.featurebox.open()
  }

  toggleThaiInput() {
    this.thai_input = !this.thai_input;
  }

  toggleThaiDesc() {
    this.thai_description = !this.thai_description;
  }

  autoGenerateDesc() {
    let $html = '';


    let $beds = this.form.value.beds;
    let $baths = this.form.value.baths;
    let $sqm = this.form.value.sqm;
    let $station = this.form.value.station;
    let $prop_type = this.form.value.listing_type;
    let $house_type = this.form.value.house_type;
    let $land_area = this.form.value.area;
    let district_ = this.form.value.district;
    let sub_district_ = this.form.value.district_city;
    let $project = this.form.value.building;
    let $furnished = this.form.value.furnishing;
    let $sale_price = this.form.value.sale_price;
    let $rent_price = this.form.value.rent_price;



    let $address = '';
    if (district_ && sub_district_) {
      $address = ' in ' + district_ + ', ' + sub_district_;
    } else if (district_) {
      $address = ' in ' + district_;
    } else if (sub_district_) {
      $address = ' in ' + sub_district_;
    }

    let $rent_or_buy = $prop_type;
    if ($prop_type == 'Rent, Buy') {
      $rent_or_buy = 'Rent & Sale';
    } else if ($prop_type == 'buy') {
      $rent_or_buy = 'Sale';
    }

    

    if($beds && $baths) {
      $html += this.titleCase.transform(this.ngxNumToWordsService.inWords($beds, 'en')) + ' bedroom';
      $html += ', '+this.ngxNumToWordsService.inWords($baths, 'en').toLowerCase()  + ' bathroom';
    }else if($beds) {
        $html += this.titleCase.transform(this.ngxNumToWordsService.inWords($beds, 'en')) + ' bedroom';
    }else if($baths) {
        $html += this.titleCase.transform(this.ngxNumToWordsService.inWords($beds, 'en')) + ' bathroom';
    }
    if($furnished) {
      if($html == '') {
        $html += $furnished.toLowerCase()+' furnished';
      }else {
        $html += ' '+$furnished.toLowerCase()+' furnished';
      }
    }
    if($house_type) {
      if($html == '') {
        $html += $house_type.toLowerCase();
      }else {
        $html += ' '+$house_type.toLowerCase();
      }
    }

    $html += ' available for ';

    if($rent_or_buy) {
      $html += $rent_or_buy.toLowerCase();
    }

    if(district_) {
      $html +=  ' conveniently located in '+ district_;
    }

    if($house_type == 'Condominium') {
      if($project) {
        $html += ' at '+$project.name;
      }
    }

    $html += '.';

    $html = '<p>'+$html+'</p>';

    if($house_type != 'Condominium' && $sqm) {
      $html += '<p>Useable space: '+$sqm+' m2</p>';
    }

    if($land_area && ($house_type == 'House' || $house_type == 'Land' || $house_type == 'Townhouse')) {
      $html += '<p>Land area: '+$land_area+' m2</p>';
    }

    if(district_ && this.landmark) {
      $html += '<p>Near by:</p>';
      $html += '<p>'+this.landmark.name+'</p>';
    }

    if($prop_type) {
      if($prop_type == 'rent') {
        $html += '<p>Rental Price: ฿'+$rent_price+' / month</p>';
      }
      if($prop_type == 'buy') {
        $html += '<p>Sale Price: ฿'+$sale_price+'</p>';
      }
      if($prop_type == 'Rent, Buy') {
        $html += '<p>Sale Price: ฿'+$sale_price+'</p>';
        $html += '<p>Rental Price: ฿'+$rent_price+' / month</p>';
      }
    }

    $html += '<p>Contact '+this.auth.getUser().org_name+' for more details.</p>';

    $html = $html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
    $html = $html.replace('<br>', '\n');
    this.form.controls.description.setValue($html);
    // return $html;

  }

  enableFloorPlan() {
    this.is_floor_plan = !this.is_floor_plan;
  }

  ucwords(str) {
    return str;
  }

  replace_listing_type_text(str) {
    if(str) {
      let s = str.replace('buy', 'Sale');
      let v = s.replace('Buy', 'Sale');
      return v.replace('Rent, Sale', 'Rent & Sale')
    }
  }

  numberWithCommasSale(e) {
    if (window.event) {
            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8) {
                event.returnValue = false;
                return false;
            }
        }
        else { // Fire Fox
            if ((e.which < 48 || e.which > 57) && e.which != 8) {
                e.preventDefault();
                return false;
            }
    }

    if (e.target.value.indexOf(',') !== -1) {
      e.target.value = e.target.value.replace(/,/g, '');
    }

    let v = e.target.value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.form.controls.sale_price.setValue(v);
  }

  numberWithCommasRent(e) {
    if (window.event) {
            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8) {
                event.returnValue = false;
                return false;
            }
        }
        else { // Fire Fox
            if ((e.which < 48 || e.which > 57) && e.which != 8) {
                e.preventDefault();
                return false;
            }
    }
    if (e.target.value.indexOf(',') !== -1) {
      e.target.value = e.target.value.replace(/,/g, '');
    }

    let v = e.target.value
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.form.controls.rent_price.setValue(v);
  }

  removeComma(value) {
    if (value.indexOf(',') !== -1) {
        return value.replace(/,/g, '');
    }
  }

  onChange(event) {
    const f: CalendarResult = event.from;
    const t: CalendarResult = event.to;
    this.date = f + '-' + t;

    const date: CalendarResult = event.data;
    console.log(date);

    console.log(this.date)
  }

  onChangeForm(event) {
    console.log(event);
  }

  changeTitleTab(val) {
    this.title_tab = val;
  }

  changeDescTab(val) {
    this.desc_tab = val;
  }

  toggleActionMenu() {
    
    this.isOpenActionMenu = !this.isOpenActionMenu;
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 100);
    
  }

  toggleDropdownMenu() {
    console.log('e');
    this.is_property_type_clicked = !this.is_property_type_clicked;
  }

  calculateSize(val) {
    if(val > 0 && val < 3) {
      return val * 30+'px';
    }if(val > 2 && val < 7) {
      return val * 15+'px';
    }if(val > 7) {
      return val * 12.39+'px';
    }else {
      return '100px';
    }
  }

  calculateSizeRent(val) {
    if(val > 0 && val < 3) {
      return val * 30+'px';
    }if(val > 2 && val < 7) {
      return val * 15+'px';
    }if(val > 7) {
      return val * 12.39+'px';
    }else {
      return '100px';
    }
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

  statusClass(item) {
    if(item.status == '2' || item.status == '3') {
      return 'green';
    }else {
      return 'blue';
    }
    
  }

  generateArrayOfYears() {
    var max = new Date().getFullYear()
    var min = max - 73
    var years = []

    for (var i = max; i >= min; i--) {
      years.push(i)
    }
    return years
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
