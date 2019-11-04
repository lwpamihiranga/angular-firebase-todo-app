import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Todo } from '../todo/todo';
import { Observable, TimeoutError } from 'rxjs';
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

  editClick(todo, id) {
    this.todoId = id;
    this.myValue = todo;
  }

  setReminder(id, dateValue) {
    console.log("id", id);
    console.log("value", dateValue);

    this.userService.setRemider(id, dateValue);
  }

  checkDate(date) {
    const now = new Date().toLocaleDateString();
    const nowDate = new Date().getDate();
    const nowMonth = new Date().getMonth();
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

    if(dueYear > nowYear) {
      console.log('has time')
      return true;
    } else if(dueYear == nowYear) {
      if(dueMonth > nowMonth) {
      console.log('has time')

        return true;
      } else if(dueMonth == nowMonth) {
        if(dueDate > nowDate) {
      console.log('has time')

          return true;
        } else if(dueDate == nowDate) {
          if(dueHour > nowHour) {
      console.log('has time')

            return true;
          } else if(dueHour == nowHour) {
            if(dueMin > nowMin) {
      console.log('has time')

              return true;
            }
          }
        }
      }
    } else {
      console.log('expired')

      return false;
    }
    return true;
  }
}
