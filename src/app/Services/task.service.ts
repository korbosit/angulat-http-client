import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { catchError, map, tap } from 'rxjs/operators';
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
        `https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json`,
        { observe: 'events', responseType: 'json' }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
          }
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
      )
      .subscribe({
        error: (err) => {
          this.errorSubject.next(err);
        },
      });
  }

  GetAllTasks() {
    let headers = new HttpHeaders();
    // Adds
    headers = headers.append('content-type', 'application/json');
    headers = headers.append('content-type', 'text/html');

    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', 2);
    queryParams = queryParams.set('item', 10);

    return this.http
      .get<{ [key: string]: Task }>(
        'https://angularhttpclient-fc045-default-rtdb.firebaseio.com/tasks.json',
        { headers: headers, params: queryParams, observe: 'body' }
      )
      .pipe(
        map((response) => {
          // We'll get an object, so we'll convert it to an array of objects
          let tasks = [];
          console.log(response);
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
