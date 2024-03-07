import { Component, OnInit, inject } from '@angular/core';
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
  taskService: TaskService = inject(TaskService);
  currentTaskId: string = '';
  editMode: boolean = false;
  selectedTask: Task;
  isLoading: boolean = false;

  errorMessage: string | null = null;

  ngOnInit() {
    this.fetchAllTasks();
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
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    // console.log(err);
    if (err.error.error === 'Permission denied') {
      this.errorMessage = 'You do not have permissionto perfom this action';
    }
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
