import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import {
  ItemColSpanModel,
  ItemRowSpanModel,
  StyleAllCellsDefault,
  StyleTableDefault,
  StyleTableDefaultModel
} from '../models/export-excel.model';

@Injectable()
export class ExportExcelService {
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  exportJsonToExcel(
    json: any,
    header_data: any,
    file_name: string = '',
    listRowSpan?: Array<ItemRowSpanModel>,
    listColSpan: Array<ItemColSpanModel> = [
      { c: 1, keyCheckDisplay: 'isDisplay', keyRowSpan: 'rowspan' },
      { c: 2, keyCheckDisplay: 'isDisplay', keyRowSpan: 'rowspan' }
    ],
    listItemHeader: Array<number> = [],
    styleObj: StyleTableDefaultModel = StyleTableDefault
  ) {
    // Create a new worksheet with the JSON data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {
      skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(
      ws,
      [header_data.main_title, header_data.col_title],
      {
        origin: 'A1'
      }
    );

    const wscols = Array(header_data.main_title.length).fill({ wch: 24 });
    wscols[0] = { wch: 7 };
    wscols[1] = { wch: 32 };

    ws['!cols'] = wscols;
    const mergeHeader = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: header_data.main_title.length - 1 }
      }
    ];
    if (listRowSpan && listRowSpan.length > 0) {
      listRowSpan.forEach((item: ItemRowSpanModel, index: number) => {
        listColSpan.forEach((d: ItemColSpanModel) => {
          if (item[d.keyCheckDisplay]) {
            mergeHeader.push({
              s: { r: index + 2, c: d.c },
              e: { r: index + 1 + item[d.keyRowSpan], c: d.c }
            });
          }
        });
      });
    }
    ws['!merges'] = mergeHeader;
    for (const i in ws) {
      if (typeof ws[i] !== 'object') continue;
      if (!ws[i].v) {
        ws[i].v = ' ';
      }
      if (ws[i].v === 'Cả ngày') {
        mergeHeader.push({
          s: { r: +i.slice(1) - 1, c: 7 },
          e: { r: +i.slice(1) - 1, c: 8 }
        });
        ws['!merges'] = mergeHeader;
      }
      const cell = XLSX.utils.decode_cell(i);
      ws[i].s = { ...StyleAllCellsDefault };
      if (cell.r) {
        // first row
        ws[i].s.border.bottom = {
          // bottom border
          style: 'thin',
          color: '000000'
        };
      }

      if (cell.r === 0) {
        ws[i].s = styleObj.title;
      }
      if (cell.r === 1) {
        // every other row
        ws[i].s = styleObj.header;
      }
      if (listItemHeader.length > 0) {
        json.forEach((item: any, index: number) => {
          if (
            item.STT &&
            !item?.['LOẠI'] &&
            cell.r === index &&
            listItemHeader.find((indexHeader: number) => cell.c === indexHeader)
          ) {
            ws[i].s.font = styleObj.itemGroup?.font;
          }
        });
      }
    }

    const fileName = file_name || 'Package report';
    // Create a new workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');

    // Generate buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    // Save to file
    const data: Blob = new Blob([excelBuffer], {
      type: this.EXCEL_TYPE
    });
    saveAs(data, `${fileName}.xlsx`);
  }
}
