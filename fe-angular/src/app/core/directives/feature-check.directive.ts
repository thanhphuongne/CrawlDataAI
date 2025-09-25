import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { FeatureCheckService } from '../services/feature-check.service';
@Directive({
  standalone: true,
  selector: '[featureCheck]'
})
/**
 * How to use?
 * Using like this: *featureCheck="['read','write']; packageKey 'package-name'; Operation 'AND'"; else Template"
 */
export class FeatureCheckDirective implements OnInit {
  /**
   * Else condition
   * Else template after primary condition false
   */
  @Input() permissionsElse?: TemplateRef<unknown>;
  // list permission from view.
  private feature: Array<string>;
  private logicalOp = 'AND';
  private packageCheck: string;

  // Using this variable for remove duplicate render view.
  private isHidden = true;

  /**
   * Array<string> permissions accepted display
   */
  @Input()
  set featureCheck(val: Array<string>) {
    this.feature = val;
    this.updateView();
  }
  @Input()
  set featureCheckPackage(val: string) {
    this.packageCheck = val;
    this.updateView();
  }
  /**
   * string operation (optional), accepted OR or AND, default AND
   */
  @Input()
  set permissionsOperation(val: 'OR' | 'AND') {
    this.logicalOp = val;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private service: FeatureCheckService
  ) {}
  ngOnInit(): void {
    this.updateView();
  }
  /**
   * updateView - Show hide UI follow permission
   */
  private updateView() {
    if (this.checkView()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
      if (this.permissionsElse) {
        this.viewContainer.createEmbeddedView(this.permissionsElse);
      }
    }
  }

  /**
   * Check show with current feature
   * @returns boolean
   */
  private checkView() {
    let allowShow = false;
    this.feature.forEach((item: string) => {
      const check = this.service.checkFeature(item, this.packageCheck);
      if (this.logicalOp === 'OR' && check) {
        allowShow = true;
      }
      if (this.logicalOp === 'AND') {
        allowShow = check;
      }
    });

    return allowShow;
  }
}
