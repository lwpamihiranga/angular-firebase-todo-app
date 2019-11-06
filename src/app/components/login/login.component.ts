import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  // userId = '';
  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
  }

  // login function: logs a user with the provided password and email.
  login() {
    this.userService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
  }
}
