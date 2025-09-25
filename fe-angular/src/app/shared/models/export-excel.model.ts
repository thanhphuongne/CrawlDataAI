export interface ItemRowSpanModel {
  rowspan: number;
  isDisplay: boolean;
  rowspanChild?: number;
  isDisplayChild?: boolean;
}

export interface ItemColSpanModel {
  c: number;
  keyCheckDisplay: 'isDisplay' | 'isDisplayChild';
  keyRowSpan: 'rowspan' | 'rowspanChild';
}

export interface StyleTableDefaultModel {
  title : any,
  header: any,
  itemGroup?: any
}

export const StyleAllCellsDefault = {
    // styling for all cells
    font: {
      name: 'arial',
      color: { rgb: '000000' }
    },
    alignment: {
      // vertical: 'center',
      horizontal: 'left',
      wraptext: 1
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      }
    }
}

export const StyleTableDefault : StyleTableDefaultModel = {
  title : {
      alignment: {
        horizontal: 'center',
        wraptext: 1
      },
      font: {
        sz: 20,
        bold: true,
        color: { rgb: '0070C0' }
      }
  },
  header: { 
    ...StyleAllCellsDefault,
    fill: {
      // background color
      patternType: 'solid',
      fgColor: { rgb: 'ffff00' },
      bgColor: { rgb: 'ffff00' }
    }
  }
}