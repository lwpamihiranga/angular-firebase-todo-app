import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<User>;
  constructor(public angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, public router: Router) { 
  }

  getCurrentUser():string {
    let userId = '';
    this.angularFireAuth.auth.onAuthStateChanged(user => {
      if(user) {
        userId = user.uid;
      }
    });
    return userId;
  }

  // register a particular user with a given email and password in firebase
  registerUser(email, password) {
    this.angularFireAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(res => {
      console.log("User Registered!");
      this.router.navigate(['todos']);
    }).catch(err => {
      alert('Registration failed. Try again');
      console.log("Something went worng!", err);
    });
  }

  // login to the firebase with the user credentials
  loginUser(email, password) {
    this.angularFireAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log("Success login");
      this.angularFireAuth.auth.onAuthStateChanged(function(user) {
        if(user)
          // this.userId = user.uid;
          console.log(user.email);
      })
        this.router.navigate(['todos']);
      }).catch(err => {
        alert('Login failed. Try again');
        console.log("Something went wrong", err);        
      });
    }

  // sign out the user
  signOut() {
    this.angularFireAuth.auth.signOut().then(res => {
      alert("SignOut");
      // how to redirect here
      this.router.navigate(['login'])
    }).catch(err => {
      alert("Error occured");
    })
  }

  // delete a particular todo
  deleteTodo(data) {
    this.angularFirestore.collection('todos').doc(data).delete()
    .then(res => {
      console.log("Todo deleted");
    }).catch(err => {
      alert("Sorry! Error occured!")
    });
  }

  // update todo function
  updateTodo(id, todo:string) {
    this.angularFirestore.collection('todos').doc(id).update({ todo: todo });
  }

  // update isChecked property
  updateIsChecked(id, value:boolean) {
    this.angularFirestore.collection('todos').doc(id).update({isChecked: value})
  }

  //set reminder function
  setRemider(id, date) {
    this.angularFirestore.collection('todos').doc(id).update({ dueDate: date }).then((res) => {
      this.checkDate(id, date);
      alert("Reminder date set");
    });
  }

  // add message function.
  // not used. created for use with notification
  addMessage(title, text, token) {
    this.angularFirestore.collection('Messages').add({
      title: title,
      text: text,
      fcmToken: token
    });
  }

  checkDate(id, date) {
    const now = new Date().toLocaleDateString();
    const nowDate = new Date().getDate();
    // const nowMonth = new Date().getMonth();
    const nowMonth = parseInt(now.slice(0,2)); // there is an error in above getMonth method. It return a one month down. that why the slicing is used
    const nowYear = new Date().getFullYear();
    const nowHour = new Date().getHours();
    const nowMin = new Date().getMinutes();
    console.log(now);
    console.log(date);

    // console.log(nowDate);
    // console.log(nowMonth);
    // console.log(nowYear);
    // console.log(nowHour);
    // console.log(nowMin);

    const dueDate = parseInt(date.slice(8,10));
    const dueMonth = parseInt(date.slice(5,7));
    const dueYear = parseInt(date.slice(0,4));
    const dueHour = parseInt(date.slice(11,13));
    const dueMin = parseInt(date.slice(14,));


    // console.log(dueDate);
    // console.log(dueMonth);
    // console.log(dueYear);
    // console.log(dueHour);
    // console.log(dueMin);

    // checking whether the current date and time has exceeded the due date of the task
    if(dueYear > nowYear) {
      console.log('Not exceeded the due date');
      this.updateIsChecked(id, false);
    } else if(dueYear == nowYear) {
      if(dueMonth > nowMonth) {
        console.log('Not exceeded the due date');
        this.updateIsChecked(id, false);
      } else if(dueMonth == nowMonth) {
        if(dueDate > nowDate) {
          console.log('Not exceeded the due date');
          this.updateIsChecked(id, false);
        } else if(dueDate == nowDate) {
          if(dueHour > nowHour) {
            console.log('Not exceeded the due date');
            this.updateIsChecked(id, false);
          } else if(dueHour == nowHour) {
            if(dueMin > nowMin) {
              console.log('Not exceeded the due date');
              this.updateIsChecked(id, false);
            } else {
              console.log('Due date expired');
              this.updateIsChecked(id, true);
            }
          } else {
            console.log('expired');
            this.updateIsChecked(id, true);
          }
        } else {
          console.log('Due date expired');
          this.updateIsChecked(id, true);
        }
      } else {
        console.log('Due date expired');
        this.updateIsChecked(id, true);
      }
    } else {
      console.log('Due date expired');
      this.updateIsChecked(id, true);
    }

    // this.userService.addMessage()
  }
}
