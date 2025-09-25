import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  model,
  OnChanges,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class CounterComponent implements OnChanges {
  from = input(0);
  to = model(0);
  of = input(0);
  // This value using for reinit countdown case previous value is same current
  timeReset = input(0);
  @Output() finished = new EventEmitter();

  circleColor = 'rgba(var(--red-5), var(--opacity))';
  counter: any;
  private _count: number;
  private _percentDone = 0;
  get percentDone(): number {
    return this._percentDone;
  }

  set percentDone(value: number) {
    this._percentDone = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  ngOnChanges(): void {
    this.step();
  }

  getBarStyle(): any {
    const rotateDeg = 360 * this.percentDone;
    return {
      transform: `rotate(${rotateDeg}deg)`,
      'border-color': this.circleColor,
    };
  }

  getFillStyle(): any {
    const rotateDeg = this.percentDone > 0.5 ? 180 : 0;
    return {
      display: this.percentDone <= 0.5 ? 'none' : 'block',
      transform: `rotate(${rotateDeg}deg)`,
      'border-color': this.circleColor,
    };
  }

  private step(): void {
    clearInterval(this.counter);
    if (!this.of()) return;
    if (this.to() <= 0) {
      this.to.set(0);
      return;
    }
    this.count = this.from();
    this.percentDone = this.to() / this.of() - this.count / this.of();
    this.counter = setInterval(() => {
      if (this.count >= this.to() - 1 || this.to() <= 1) {
        this.finished.emit();
        clearInterval(this.counter);
        this.count = this.to();
        this.percentDone = 0;
      } else {
        ++this.count;
        this.percentDone = this.to() / this.of() - this.count / this.of();
      }
    }, 1000);
  }
}
