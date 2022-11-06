import { utils, WorkBook, WorkSheet, writeFile } from 'xlsx';

const exportAsXlsx = (
  spreadSheetData: any,
  fileName: string,
  sheetName: string
) => {
  const ws: WorkSheet = utils.json_to_sheet(spreadSheetData, {
    skipHeader: true,
  });
  const wb: WorkBook = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  // name the file date and time wise
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const timeStr = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const fileNameWithDate = `${fileName}-${dateStr}-${timeStr}.xlsx`;
  writeFile(wb, fileNameWithDate + '.xlsx');
};

export default exportAsXlsx;
