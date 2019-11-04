import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { environment } from 'src/environments/environment';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { RegisterComponent } from './components/register/register.component';

import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule, AngularFireMessaging } from '@angular/fire/messaging'; 
import { LoginComponent } from './components/login/login.component';
import { AsyncPipe } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TodoListComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireMessagingModule,
    AngularFireAuthModule
  ],
  providers: [AngularFireAuth, AsyncPipe, AngularFireDatabase ],
  bootstrap: [AppComponent]
})
export class AppModule { }
