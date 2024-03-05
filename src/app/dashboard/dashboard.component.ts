import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from './create-task/create-task.component';
import { Task } from '../Model/Task';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateTaskComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];

  ngOnInit() {
    this.fetchAllTasks();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CreateTask(data: Task) {
    // console.log(data);
    const headers = new HttpHeaders({ 'my-header': 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json',
        data,
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
        // so that when you click the create task button a new task appeared on the dashboard
        this.fetchAllTasks();
      });
  }

  FetchAllTaskClicked() {
    this.fetchAllTasks();
  }

  /* {
    key: {},
    key: {},
  }
  */

  private fetchAllTasks() {
    // This code will return us an array and in this array you will have task objects

    this.http
      .get<{ [key: string]: Task }>(
        'https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json'
      )
      .pipe(
        map((response) => {
          // We'll get an object, so we'll convert it to an array of objects
          let tasks = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              // Push a new object in the array
              tasks.push({ ...response[key], id: key });
            }
          }

          return tasks;
        })
      )
      .subscribe((tasks) => {
        // console.log(tasks);
        this.allTasks = tasks;
        // console.log(tasks);
      });
  }

  DeleteTask(id: string | undefined) {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks/${id}.json`
      )
      // .subscribe((res) => {
      //   console.log(res);
      // });
      .subscribe((res) => {
        this.fetchAllTasks();
      });
  }

  DeleteAllTask() {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json`
      )
      .subscribe((res) => {
        this.fetchAllTasks();
      });
  }
}

// Конечно, предположим, у вас есть объект response, который содержит данные о задачах в виде ключей и объектов задач:

// typescript
// Copy code
// let response = {
//   "-NsDNTHvD-o4Gh7xFgA7": {
//     title: "Task 1",
//     assignedTo: "John",
//     priority: "High",
//     status: "Open"
//   },
//   "-NsDNTHvD-o4Gh7xFgA8": {
//     title: "Task 2",
//     assignedTo: "Jane",
//     priority: "Medium",
//     status: "In Progress"
//   }
// };
// Когда вы применяете ваш цикл for...in к объекту response и используете его для создания массива tasks, результат будет выглядеть следующим образом:

// typescript
// Copy code
// let tasks = [];

// for (let key in response) {
//   if (response.hasOwnProperty(key)) {
//     tasks.push({ ...response[key], id: key });
//   }
// }

// console.log(tasks);
// После выполнения этого кода массив tasks будет выглядеть так:

// typescript
// Copy code
// [
//   {
//     title: "Task 1",
//     assignedTo: "John",
//     priority: "High",
//     status: "Open",
//     id: "-NsDNTHvD-o4Gh7xFgA7"
//   },
//   {
//     title: "Task 2",
//     assignedTo: "Jane",
//     priority: "Medium",
//     status: "In Progress",
//     id: "-NsDNTHvD-o4Gh7xFgA8"
//   }
// ]
// В этом массиве каждая задача расширена свойством id, которое соответствует ключу объекта response, и все остальные свойства задачи остаются такими же, как в исходных объектах задач в response.
