import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  forgetPasswordForm: FormGroup;
  isSubmitted = false;
  private myToast: any;
  private myloading: any;
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private fb: FormBuilder, 
    private auth: AuthenticationService,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
    ) { }

  ngOnInit() {

    let token = this.auth.getToken();
    if(token) {
      this.router.navigate(['app']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    });
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    })
  }

 

  submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      // this.showLoading();
      this.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: data => {
          // this.hideLoading();
          if(data.success) {
            this.isSubmitted = false;
            this.auth.saveToken(data.token, JSON.stringify(data.user));
            this.router.navigate(['app']);
          }else {
            this.showToast(data.message);
            this.isSubmitted = false;
          }
        },
        error: err => {
          // console.log(err.error.messages.error);
          // this.hideLoading();
          this.showToast(err.error.messages.error);
          this.isSubmitted = false;
        }
      });
      
    }
  }

  submitForgetForm() {
    this.isSubmitted = true;
    if (!this.forgetPasswordForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      // this.showLoading();
      this.auth.forgetPassword(this.forgetPasswordForm.value.email).subscribe({
        next: data => {
          // this.hideLoading();
          if(data.status == 200 && data.success) {
            this.showToast(data.message);
            this.isSubmitted = false;
            this.modal.dismiss();
          }else {
            this.showToast(data.message);
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

  get errorControl() {
    return this.loginForm.controls;
  }

  get errorControlForget() {
    return this.forgetPasswordForm.controls;
  }

  showToast(message) {
    this.toast.create({
      message: message,
      position: 'top',
      color: 'danger',
      duration: 3000
    }).then((toastData) => {
      toastData.present();
    });
  }
  HideToast() {
    this.toast.dismiss();
  }

  showLoading() {
    this.loading.create({
      message: 'Please wait...',
      spinner: 'circles'
    }).then((loadingData) => {
      loadingData.present();
    });
  }

  hideLoading() {
    this.loading.dismiss();
  }

}
