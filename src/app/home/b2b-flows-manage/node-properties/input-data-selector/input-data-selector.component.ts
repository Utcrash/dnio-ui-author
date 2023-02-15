import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { B2bFlowService } from '../../b2b-flow.service';

@Component({
  selector: 'odp-input-data-selector',
  templateUrl: './input-data-selector.component.html',
  styleUrls: ['./input-data-selector.component.scss']
})
export class InputDataSelectorComponent implements OnInit {

  @Input() edit: any;
  @Input() currNode: any;
  @Input() nodeList: Array<any>;
  @Input() data: any;
  @Output() dataChange: EventEmitter<any>;
  showCustomWindow: boolean;
  dataType: string;
  toggle: any;
  inputDataStructure: any;
  sampleJSON: any;
  tempData: any;
  constructor(private flowService: B2bFlowService) {
    this.edit = { status: false };
    this.dataChange = new EventEmitter();
    this.dataType = 'single';
    this.toggle = {};
  }

  ngOnInit(): void {
    this.toggle['payloadCreator'] = true;
    this.inputDataStructure = this.currNode.dataStructure.incoming || {};
    if (this.data != undefined && this.data != null && typeof this.data == 'object') {
      this.dataType = 'single';
    } else {
      this.dataType = 'multiple';
    }
    if (this.data && typeof this.data == 'object') {
      this.sampleJSON = this.data;
    } else if (!this.data && this.inputDataStructure) {
      this.sampleJSON = this.flowService.jsonFromStructure(this.inputDataStructure);
    } else {
      this.sampleJSON = {};
    }

    this.flowService.dataStructureSelected.subscribe((data) => {
      if (data.currNode._id == this.currNode._id && data.type == 'incoming') {
        this.inputDataStructure = data.currNode.dataStructure.incoming || {};
        this.sampleJSON = this.flowService.jsonFromStructure(this.inputDataStructure);
      }
    });
  }

  toggleDataType(flag: boolean, type: string) {
    this.data = null;
    this.dataChange.emit(null);
    if (flag) {
      this.dataType = type;
    }
    this.showCustomWindow = true;
  }

  // onVariableSelect(data: string) {
  //   if (data.startsWith('{{')) {
  //     data = data.substring(2, data.length - 2);
  //   }
  // }

  onDataChange(data: string) {
    // this.dataChange.emit(this.data);
  }

  cancel() {
    this.showCustomWindow = false;
  }

  onPaste(event: ClipboardEvent) {
    let text: string = event.clipboardData?.getData('text') as string;
    try {
      const obj = JSON.parse(text);
      this.sampleJSON = obj;
    } catch (err) {
      this.sampleJSON = text.split('\n').reduce((prev: any, e: string) => {
        prev[e] = "";
        return prev;
      }, {});
    }
    this.toggle['pasteJSON'] = false;
    this.toggle['payloadCreator'] = false;
    setTimeout(() => {
      this.toggle['payloadCreator'] = true;
    }, 200);
  }

  get userData() {
    let temp;
    if (this.data && this.data.startsWith('node[')) {
      temp = '{{' + this.data + '}}';
      return this.flowService.getDynamicLabel(this.flowService.parseDynamicValue(temp), this.nodeList);
    }
    return this.data;
  }
}
