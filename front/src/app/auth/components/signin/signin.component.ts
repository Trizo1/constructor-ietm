import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { SubSink } from 'subsink';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  hidePass = true;
  loginFormGroup: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataStore: DataStoreService,
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit() {
    if (this.loginFormGroup.valid)
      this.subs.add(
        this.authService.login(this.loginFormGroup.value).subscribe(
          (user: any) => {
            // this.dataStore.setUser(user);
            this.router.navigate(['editor']);
          },
          (err: any) => {
            console.log(err);
          },
        ),
      );
  }

  initializeLoginForm() {
    this.loginFormGroup = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
