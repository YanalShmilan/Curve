import _ from 'lodash';
import { utils, WorkBook, WorkSheet, writeFile } from 'xlsx';
import IStudent from '../interfaces/IStudent';

const exportAsXlsx = (
  spreadSheetData: any,
  fileName: string,
  sheetName: string
) => {
  // Group data by row
  const grouped = _.groupBy(spreadSheetData, '__rowNum__');

  spreadSheetData = Object.values(grouped).map((row: any) => {
    const newData = Object.values(row[0]).map((item: any) => {
      return item;
    });
    return newData;
  });
  const newData: IStudent[] = spreadSheetData.map(
    (row: any, index: number) => {
      return {
        'Serial No#': row[0],
        'Student ID': row[1],
        'Student Name Arabic': row[2],
        'Student Gender': row[3],
        'Email Address': row[4],
        Section: row[5],
        'Instruction Name Arabic': row[6],
        GPA: row[7],
        'Credit Registered': row[8],
        'Repeat Count': row[9],
        'Probation Count': row[10],
        Major: row[11],
        Status: row[12],
        Nationality: row[13],
        __rowNum__: index + 1,
      };
    }
  );
  const ws: WorkSheet = utils.json_to_sheet(newData, {
    skipHeader: true,
  });
  const wb: WorkBook = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, fileName + '.xlsx');
};

export default exportAsXlsx;
