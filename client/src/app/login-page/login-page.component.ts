import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs/index";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  private aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.createForm();
    this.checkParams();
  }

  private createForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    })
  }

  public onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.getRawValue())
      .subscribe(
        () => {
          this.router.navigate(['/overview']).then();
        },
        (error) => {
          this.form.enable();
          MaterialService.toast(error.error.message)
        })
  }

  public checkParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('You can enter with you r data')
      } else if (params['accessDenied']) {
        MaterialService.toast('first you need log-in')
      } else if (params['sessionFailed']) {
        MaterialService.toast('You need re-login')
      }
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}
