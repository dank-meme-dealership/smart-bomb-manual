import {Component} from '@angular/core';
import {xor} from 'lodash';
import {BombStateService} from 'src/app/services/bomb-state.service';

interface WiresColumn {
  led: boolean;
  wires: string[];
  star: boolean;
}

@Component({
  selector: 'app-complicated-wires',
  templateUrl: './complicated-wires.component.html',
  styleUrls: ['./complicated-wires.component.scss'],
})
export class ComplicatedWiresComponent {
  selectedColumn = 0;
  columns: WiresColumn[] = [
    {led: false, wires: [], star: false},
    {led: false, wires: [], star: false},
    {led: false, wires: [], star: false},
    {led: false, wires: [], star: false},
    {led: false, wires: [], star: false},
    {led: false, wires: [], star: false},
  ];

  constructor(
      public bombStateService: BombStateService,
  ) {}

  selectColumn(index: number) {
    this.selectedColumn = index;
  }

  selectNextColumn() {
    this.selectColumn((this.selectedColumn + 1) % 6);
  }

  toggleColor(color: string) {
    const column = this.columns[this.selectedColumn];
    column.wires = xor(column.wires, [color]);
  }

  /**
   * Determing if a given column should be cut based on its own properties as
   * well as some global ones about the bomb
   * @param column
   */
  shouldCut(column: WiresColumn): boolean {
    if (column.wires.length === 0) {
      return false;
    }

    if (column.wires.includes('red')) {
      if (column.wires.includes('blue')) {
        if (column.star) {
          if (column.led) {
            return false;
          } else {
            return this.bombStateService.parallel;
          }
        } else {
          if (column.led) {
            return this.bombStateService.serialEven;
          } else {
            return this.bombStateService.serialEven;
          }
        }
      } else {
        if (column.star) {
          if (column.led) {
            return this.bombStateService.batteries >= 2;
          } else {
            return true;
          }
        } else {
          if (column.led) {
            return this.bombStateService.batteries >= 2;
          } else {
            return this.bombStateService.serialEven;
          }
        }
      }
    } else {
      if (column.wires.includes('blue')) {
        if (column.star) {
          if (column.led) {
            return this.bombStateService.parallel;
          } else {
            return false;
          }
        } else {
          if (column.led) {
            return this.bombStateService.parallel;
          } else {
            return this.bombStateService.serialEven;
          }
        }
      } else {
        if (column.star) {
          if (column.led) {
            return this.bombStateService.batteries >= 2;
          } else {
            return true;
          }
        } else {
          if (column.led) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
}
