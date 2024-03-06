import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ 'my-header': 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json',
        task,
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
        // // so that when you click the create task button a new task appeared on the dashboard
        // this.fetchAllTasks();
      });
  }

  DeleteTask(id: string | undefined) {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks/${id}.json`
      )
      .subscribe((res) => {});
  }

  DeleteAllTasks() {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json`
      )
      .subscribe();
  }

  GetAllTasks() {
    // This code will return us an array and in this array you will have task objects
    return this.http
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
      );
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
