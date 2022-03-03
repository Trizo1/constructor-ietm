import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-upload-model',
  templateUrl: './upload-model.component.html',
  styleUrls: ['./upload-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadModelComponent implements OnInit {
  @Input() step: number;
  @Output() changedStep = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
