import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../shared/services/auth.service";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private aSub: Subscription;
  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.createForm();
  }
  private createForm() {
    this.form =new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    })
  }
  public onSubmit() {
    this.form.disable();
    this.aSub = this.auth.register(this.form.getRawValue())
      .subscribe(
        () => {
          this.router.navigate(['/login'], {
            queryParams: {
              registered : true
            }
          }).then();
        },
        (error) => {
          this.form.enable();
          MaterialService.toast(error.error.message);
          })
  }
  ngOnDestroy(): void {
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}
