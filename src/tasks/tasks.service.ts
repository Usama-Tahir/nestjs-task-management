import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasksWithFilters(filteredDto: GetTasksFilterDto): Task[] {
    const { status, search } = filteredDto;
    let tasks: Task[] = this.getAllTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task: Task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id# ${id} not found!`);
    }
    return task;
  }

  deleteTaskById(id: string): void {
    const taskTOdelete: Task = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== taskTOdelete.id);
  }

  updateTaskStatusById(id: string, taskStatus: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    task.status = taskStatus;
    return task;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
