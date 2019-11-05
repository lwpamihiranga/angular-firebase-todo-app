import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Todo } from '../todo/todo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';

 

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent   {
  private todoCollection: AngularFirestoreCollection<Todo>;
  
  todos: Observable<Todo[]>;

  userId = '';
  myValue = '';
  todoId = '';
  editDisable = true;
  constructor(private readonly afs: AngularFirestore, public afa: AngularFireAuth, private userService: UserService) { 
      this.afa.auth.onAuthStateChanged(user => {
        if(user) {
          this.userId = user.uid;
          this.todoCollection =  afs.collection<Todo>('todos', ref => ref.where('userId', '==', this.userId));
          this.todos = this.todoCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as Todo;
              const id = a.payload.doc.id;
              return {id , ...data };
            }))
          );
        }
    });
  }

  ngOnInit() {
  }

  deleteTodo(id) {
    this.userService.deleteTodo(id);
  }

  updateTodo(id, todo) {
    this.userService.updateTodo(id, todo);
    this.myValue = '';
  }

  updateChecked(id, value:boolean) {
    this.userService.updateIsChecked(id, value);
  }

  editClick(todo, id) {
    this.todoId = id;
    this.myValue = todo;
    this.editDisable = false;
  }

  setReminder(id, dateValue) {
    console.log("id", id);
    console.log("value", dateValue);

    this.userService.setRemider(id, dateValue);
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
      this.updateChecked(id, false);
    } else if(dueYear == nowYear) {
      if(dueMonth > nowMonth) {
        console.log('Not exceeded the due date');
        this.updateChecked(id, false);
      } else if(dueMonth == nowMonth) {
        if(dueDate > nowDate) {
          console.log('Not exceeded the due date');
          this.updateChecked(id, false);
        } else if(dueDate == nowDate) {
          if(dueHour > nowHour) {
            console.log('Not exceeded the due date');
            this.updateChecked(id, false);
          } else if(dueHour == nowHour) {
            if(dueMin > nowMin) {
              console.log('Not exceeded the due date');
              this.updateChecked(id, false);
            } else {
              console.log('Due date expired');
              this.updateChecked(id, true);
            }
          } else {
            console.log('expired');
            this.updateChecked(id, true);
          }
        } else {
          console.log('Due date expired');
          this.updateChecked(id, true);
        }
      } else {
        console.log('Due date expired');
        this.updateChecked(id, true);
      }
    } else {
      console.log('Due date expired');
      this.updateChecked(id, true);
    }

    // this.userService.addMessage()
  }
}
