import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as uuid from 'uuid/v1';

@Component({
  selector: 'odp-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() id: string;
  @Input() type: string;
  @Input() disabled: boolean;
  @Input() edit: any;
  @Input() size: number;
  @Input() checked: boolean;
  @Output() checkedChange: EventEmitter<boolean>;
  constructor() {
    this.checkedChange = new EventEmitter();
    this.edit = {
      status: false
    };
    this.id = uuid();
    this.type = 'dark'
    this.size = 18;
    this.disabled = false;
  }

  ngOnInit() {

  }


  onChange(value) {
    if (this.edit.status) {
      this.checked = value;
      this.checkedChange.emit(value);
    }
  }

  get checkBoxStyle() {
    return {
      'min-width': this.size + 'px',
      'max-width': this.size + 'px',
      'min-height': this.size + 'px',
      'max-height': this.size + 'px'
    };
  }

  get checkBoxClass() {
    const classes = [];
    if (this.edit.status && !this.disabled) {
      classes.push('hover');
    }
    if (this.checked) {
      classes.push(`bg-${this.type} border-${this.type}`);
    }
    if(this.disabled) {
      classes.push('disabled');
    }
    return classes.join(' ');
  }
}
