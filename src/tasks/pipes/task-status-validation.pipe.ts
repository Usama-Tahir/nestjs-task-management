import { PipeTransform, BadRequestException } from '@nestjs/common';

import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('no valid status was provided');

    }
    value = value.toUpperCase();
    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is not a valid status`);
    }
    return value;
  }
  private isValidStatus(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
