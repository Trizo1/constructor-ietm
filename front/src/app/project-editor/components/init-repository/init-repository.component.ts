import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogChooseImageComponent } from 'src/app/dialogs/dialog-choose-image/dialog-choose-image.component';
import { RepositoryI } from 'src/app/shared/models/repository.interface';
import { RepositoryType } from 'src/app/shared/models/repositoryTypeEnum';
import { TeamI } from 'src/app/shared/models/team.interface';
import { DataStoreService } from 'src/app/shared/services/data-store.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RepositoryService } from 'src/app/shared/services/repository.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-init-repository',
  templateUrl: './init-repository.component.html',
  styleUrls: ['./init-repository.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitRepositoryComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  @Input() step: number;
  @Output() changeStep = new EventEmitter();

  repositoryGroup: FormGroup;
  repositoryPreview = '';
  userTeams: TeamI[] = [];

  constructor(
    public dataStore: DataStoreService,
    public dialog: MatDialog,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private repositoryService: RepositoryService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userTeams = this.route.snapshot.data.teams;
    this.repositoryGroup = this.fb.group({
      author: new FormControl(this.dataStore.getUserValue()?._id, [Validators.required]),
      team: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      preview: new FormControl('', [Validators.required]),
      //participants,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getType() {
    return RepositoryType;
  }

  openDialogChooseImage(): void {
    const dialogRef = this.dialog.open(DialogChooseImageComponent, {
      width: '450px',
      height: '450px',
      autoFocus: false,
    });

    this.subs.add(
      dialogRef.afterClosed().subscribe((result: { imageUrl: string; image: any }) => {
        if (result) {
          this.repositoryPreview = result.image;
          this.repositoryGroup.patchValue({
            preview: result.imageUrl,
          });
          this.cdr.detectChanges();
        }
      }),
    );
  }

  create(step: number) {
    this.loadingService.setIsLoading(true);
    const newRepository: RepositoryI = {
      ...this.repositoryGroup.value,
    };
    if (newRepository.author !== this.dataStore.getUserValue()?._id) {
      newRepository.team = newRepository.author;
      newRepository.author = this.dataStore.getUserValue()!._id;
    }
    if (!newRepository.team) delete newRepository.team;
    if (!newRepository.preview) delete newRepository.preview;

    this.subs.add(
      this.repositoryService.create(newRepository).subscribe((res) => {
        this.changeStep.emit(step);
        this.loadingService.setIsLoading(false);
      }),
    );
  }
}
