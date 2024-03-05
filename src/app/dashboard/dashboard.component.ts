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
      });
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
        console.log(tasks);
      });
  }
}
