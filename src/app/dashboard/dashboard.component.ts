import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from './create-task/create-task.component';
import { Task } from '../Model/Task';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { TaskService } from '../Services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateTaskComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);
  currentTaskId: string = '';
  editMode: boolean = false;
  selectedTask: Task;
  isLoading: boolean = false;

  errorMessage: string | null = null;

  errorSub: Subscription;

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: '',
      desc: '',
      assignedTo: '',
      createdAt: '',
      priority: '',
      status: '',
    };
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task) {
    if (!this.editMode) this.taskService.CreateTask(data);
    // edit task
    else this.taskService.UpdateTask(this.currentTaskId, data);
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
    this.isLoading = true;
    this.taskService.GetAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        // this.errorMessage = error.message;
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    // console.log(err);
    if (err.error.error === 'Permission denied') {
      this.errorMessage = 'You do not have permissionto perfom this action';
    } else {
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  DeleteTask(id: string | undefined) {
    this.taskService.DeleteTask(id);
  }

  DeleteAllTask() {
    this.taskService.DeleteAllTasks();
  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;
    // OPEN EDIT TASK FORM
    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }
}
