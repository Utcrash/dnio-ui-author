import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/utils/services/app.service';
import { CommonService } from 'src/app/utils/services/common.service';
import { environment } from 'src/environments/environment';
import { B2bFlowService } from '../b2b-flow.service';

@Component({
  selector: 'odp-node-properties',
  templateUrl: './node-properties.component.html',
  styleUrls: ['./node-properties.component.scss']
})
export class NodePropertiesComponent implements OnInit {

  @Input() edit: any;
  @Input() currNode: any;
  @Input() nodeList: Array<any>;
  @Output() close: EventEmitter<any>;
  @Output() changesDone: EventEmitter<any>;
  showNodeMapping: boolean;
  showAgentSelector: boolean;
  showCodeBlock: boolean;
  prevNode: any;
  constructor(private commonService: CommonService,
    private appService: AppService,
    private flowService: B2bFlowService) {
    this.edit = { status: true };
    this.close = new EventEmitter();
    this.changesDone = new EventEmitter();
  }

  ngOnInit(): void {
    this.prevNode = this.nodeList.find(e => (e.onSuccess || []).findIndex(es => es._id == this.currNode._id) > -1);
    if (this.prevNode && !this.prevNode.dataStructure) {
      this.prevNode.dataStructure = {};
    }
    if (this.prevNode && this.prevNode.dataStructure && !this.prevNode.dataStructure.outgoing) {
      this.prevNode.dataStructure.outgoing = {};
    }
    if (this.currNode && !this.currNode.dataStructure) {
      this.currNode.dataStructure = {};
    }
    if (this.currNode && this.currNode.dataStructure && !this.currNode.dataStructure.outgoing) {
      this.currNode.dataStructure.outgoing = {};
    }
    if (this.currNode && !this.currNode.options) {
      this.currNode.options = {};
    }
  }

  closeMapping(data: any) {
    if (!data) {
      this.showNodeMapping = false;
      return;
    }
  }

  deleteNode() {
    if (this.prevNode) {
      const prevIndex = this.nodeList.findIndex(e => e._id == this.prevNode._id);
      if (prevIndex > -1) {
        const nextIndex = this.nodeList[prevIndex].onSuccess.findIndex(e => e._id == this.currNode._id);
        if (nextIndex > -1) {
          this.nodeList[prevIndex].onSuccess.splice(nextIndex, 1);
        }
      }
    }
    const currIndex = this.nodeList.findIndex(e => e._id == this.currNode._id);
    if (currIndex > -1) {
      this.nodeList.splice(currIndex, 1);
    }
    if (!environment.production) {
      console.log(this.nodeList);
    }
    this.flowService.reCreatePaths.emit();
    this.close.emit(false);
    this.flowService.selectedNode.emit(null);
  }

  onTypeChange(type: string) {
    if (!environment.production) {
      console.log(type);
    }
    this.currNode.options = {};
    this.changesDone.emit()
  }

  onFormatChange(data: any) {
    if (!environment.production) {
      console.log(data);
    }
    if (this.currNode.dataStructure) {
      this.currNode.dataStructure.outgoing = data;
    }

    this.currNode.mappings = [];
    (this.currNode.onSuccess || []).forEach(item => {
      const temp = this.nodeList.find(r => r._id == item._id);
      if (temp && temp.type == 'MAPPING') {
        temp.mappings = [];
      }
    })
    this.changesDone.emit()
  }

  cancel() {
    this.close.emit(false);
  }

  selectAgent(data: any) {
    if (!this.currNode.options.agents) {
      this.currNode.options.agents = [];
    }
    const index = this.currNode.options.agents.findIndex(e => e._id == data._id);
    if (index == -1) {
      this.currNode.options.agents.push(data);
    }
    this.showAgentSelector = false;
    this.changesDone.emit()
  }

  removeAgent(data: any) {
    const index = this.currNode.options.agents.findIndex(e => e._id == data._id);
    if (index > -1) {
      this.currNode.options.agents.splice(index, 1);
    }
    this.changesDone.emit()
  }

  setFunctionEndpoint(data: any) {
    this.currNode.options.path = `/${this.commonService.app._id}/${this.appService.toCamelCase(data.name)}`
    this.changesDone.emit()
  }

  get isInputNode() {
    return this.nodeList[0]._id == this.currNode._id;
  }
}
