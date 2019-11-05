import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  ngOnInit() {
  }

  // register user with the email and password provided in the register form
  register(email, password) {
    this.userService.registerUser(email, password);
  }
}
