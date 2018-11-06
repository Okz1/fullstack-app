import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  public loading: boolean = false;
  public positions: Position[] = [];
  public positionId = null;
  public modal: MaterialInstance;
  public form: FormGroup;

  constructor(private positionService: PositionsService) {
  }

  ngOnInit() {
    this.createForm();
    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(position => {
      this.loading = false;
      this.positions = position;
    })
  }

  public onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.modal.open();
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    MaterialService.updateTextInputs();
  }

  public onAddPosition() {
    this.modal.open();
    this.positionId = null;
  }

  public closeModal() {
    this.modal.close();
  }

  private createForm() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })
  }

  public onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Delete position ${position.name}`);
    if (decision) {
      this.positionService.delete(position)
        .subscribe(res => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions.splice(idx, 1);
            MaterialService.toast(res.message);
          },
          error => MaterialService.toast(error.error.message));
    }
  }

  public onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      category: this.categoryId,
      cost: this.form.value.cost
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition)
        .subscribe(position => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions[idx] = position;
            MaterialService.toast('position saved');
            this.form.enable()
          },
          error => {
            MaterialService.toast(error.error.message);
            this.form.enable();
          },
          completed)
    } else {
      this.positionService.create(newPosition)
        .subscribe(position => {
            MaterialService.toast('position created');
            this.positions.push(position);
            this.form.enable()
          },
          error => {
            MaterialService.toast(error.error.message);
            this.form.enable();
          },
          completed)
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }
}
