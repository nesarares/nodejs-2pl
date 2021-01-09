import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnChanges {
  @Input() error: any;
  errorMessage: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.handleError(changes.error.currentValue);
  }

  handleError(error: any) {
    if (error == null) return;
    if (typeof error === 'string') {
      this.errorMessage = error;
    } else if (typeof error === 'object') {
      this.errorMessage = (error.error || {}).message || error.message;
    } else {
      this.errorMessage = error?.toString();
    }
  }
}
