import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { LoggingService } from './Logging.Service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  loggingServise: LoggingService = inject(LoggingService);
  errorSubject = new Subject<HttpErrorResponse>();

  constructor() {}

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ 'my-header': 'hello-world' });
    this.http
      .post<{ name: string }>(
        'https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json',
        task,
        { headers: headers }
      )
      .pipe(
        catchError((err) => {
          // Write the logic to log errors

          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            datetime: new Date(),
          };
          this.loggingServise.logError(errorObj);
          return throwError(() => err);
        })
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  DeleteTask(id: string | undefined) {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks/${id}.json`
      )
      .pipe(
        catchError((err) => {
          // Write the logic to log errors

          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            datetime: new Date(),
          };
          this.loggingServise.logError(errorObj);
          return throwError(() => err);
        })
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  DeleteAllTasks() {
    this.http
      .delete(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json`
      )
      .pipe(
        catchError((err) => {
          // Write the logic to log errors

          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            datetime: new Date(),
          };
          this.loggingServise.logError(errorObj);
          return throwError(() => err);
        })
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
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
        }),
        catchError((err) => {
          // Write the logic to log errors

          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            datetime: new Date(),
          };
          this.loggingServise.logError(errorObj);
          return throwError(() => err);
        })
      );
  }

  UpdateTask(id: string | undefined, data: Task) {
    this.http
      .put(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks/${id}.json`,
        data
      )
      .pipe(
        catchError((err) => {
          // Write the logic to log errors

          const errorObj = {
            statusCode: err.status,
            errorMessage: err.message,
            datetime: new Date(),
          };
          this.loggingServise.logError(errorObj);
          return throwError(() => err);
        })
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  getTaskDetails(id: string | undefined) {
    return this.http
      .get(
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks/${id}.json`
      )
      .pipe(
        map((response) => {
          console.log(response);
          let task = {};
          task = { ...response, id: id };
          return task;
        })
      );
    // .subscribe((task) => {
    //   console.log(task);
    // });
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
