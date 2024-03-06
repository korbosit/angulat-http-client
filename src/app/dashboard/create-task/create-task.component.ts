import {
  Component,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements AfterViewInit {
  @Input()
  isEditMode: boolean = false;
  @Input()
  selectedTask: Task;
  @ViewChild('taskForm') taskForm: NgForm;
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.taskForm.value);
      // this.taskForm.setValue(this.selectedTask);
      this.taskForm.form.patchValue(this.selectedTask);
    }, 0);
  }

  OnCloseForm() {
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form: NgForm) {
    // console.log(form);
    // console.log(form.value);
    this.EmitTaskData.emit(form.value);
    this.CloseForm.emit(false);
  }
}
