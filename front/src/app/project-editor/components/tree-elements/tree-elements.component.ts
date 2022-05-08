import { NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SceneService } from 'src/app/scene/services/scene.service';
import { TreeStructureI } from 'src/app/shared/models/treeStructure.interface';
import { TreeStructureService } from 'src/app/tree-structure/services/tree-structure.service';
import * as THREE from 'three';

@Component({
  selector: 'app-tree-elements',
  templateUrl: './tree-elements.component.html',
  styleUrls: ['./tree-elements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeElementsComponent implements OnInit, OnChanges {
  @Input() tree: TreeStructureI;

  treeControl = new NestedTreeControl((node: any) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeStructureI>();

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  constructor(
    public sceneService: SceneService,
    private treeStructureService: TreeStructureService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tree && !changes.tree.firstChange) {
      this.dataSource.data = [this.tree];
    }
  }

  objectIsHidden(id: number, hiddenObjects: any[]) {
    return hiddenObjects.some((obj) => obj.id === id);
  }

  toggleObjectVisibility(node: any) {
    this.sceneService.toggleObjectVisibilityById(node.id);
  }

  fitToObject(node: any) {
    this.sceneService.fitToView(node.id, () => {});
  }
}
