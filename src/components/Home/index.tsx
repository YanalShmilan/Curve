// Components
import { Tooltip } from '@material-tailwind/react';

// Interfaces
import IStudent from '../../interfaces/IStudent';

// Utils
import _ from 'lodash';
import cx from 'classnames';

// Icons
import { ExportCurve, LampOn, Lock1 } from 'iconsax-react';

// React
import { useState } from 'react';
import { utils, WorkBook, WorkSheet, writeFile } from 'xlsx';

import { HotTable, HotColumn } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';

// Props
type homeProps = {
  data: IStudent[];
  setData: React.Dispatch<React.SetStateAction<IStudent[]>>;
  sheetData: any;
};

const Home = ({ data, setData, sheetData }: homeProps) => {
  const [mode, setMode] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  // Group data by row
  const grouped = _.groupBy(data, '__rowNum__');

  // Shape data for spreadsheet
  const [spreadSheetData, setSpreadSheetData] = useState<any[]>(
    Object.values(grouped).map((row: any) => {
      const newData = Object.values(row[0]).map((item: any) => {
        return item;
      });
      return newData;
    })
  );

  const exportData = () => {
    console.log(spreadSheetData);

    const newData: IStudent[] = spreadSheetData.map(
      (row: any, index) => {
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
    console.log(newData);

    setData(newData);
    const ws: WorkSheet = utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetData.sheetName);
    writeFile(wb, sheetData.fileName);
  };

  return (
    <div className="flex flex-col w-full gap-y-3">
      <div className="flex flex-row w-full gap-x-2 items-center">
        <h1 className="text-white">Actions: </h1>
        <Tooltip content="Export" key={1}>
          <ExportCurve
            size="28"
            className="text-green-400 hover:animate-bounce cursor-pointer"
            onClick={() => exportData()}
          />
        </Tooltip>
        <Tooltip content="Theme" key={2}>
          <LampOn
            size="28"
            variant={!mode ? 'Bold' : 'Linear'}
            className="text-yellow-600 hover:animate-bounce cursor-pointer"
            onClick={() => setMode(!mode)}
          />
        </Tooltip>
        <Tooltip content="Read Only" key={3}>
          <Lock1
            size="28"
            variant={!mode ? 'Bold' : 'Linear'}
            className={cx('hover:animate-bounce cursor-pointer', {
              'text-red-600': !readOnly,
              'text-green-600': readOnly,
            })}
            onClick={() => setReadOnly(!readOnly)}
          />
        </Tooltip>
      </div>
      <div id="hot-app" className="bg-red-200">
        <HotTable
          data={spreadSheetData}
          colHeaders={true}
          tableClassName={mode ? 'dark' : 'light'}
          readOnly={!readOnly}
          rowHeaders={true}
          licenseKey="non-commercial-and-evaluation"
          height="700"
          width="100%"
          stretchH="all"
          modifyColWidth={function (width, col) {
            if (col === 0) {
              return 50;
            }
            if (col === 1) {
              return 100;
            }
            if (col === 2) {
              return 200;
            }
            if (col === 3) {
              return 100;
            }
            if (col === 4) {
              return 200;
            }
            if (col === 5) {
              return 100;
            }
            if (col === 6) {
              return 200;
            }
            if (col === 7) {
              return 50;
            }
            if (col === 8) {
              return 100;
            }
            if (col === 9) {
              return 100;
            }
            if (col === 10) {
              return 100;
            }
            if (col === 11) {
              return 100;
            }
            if (col === 12) {
              return 100;
            }
            if (col === 13) {
              return 100;
            }
          }}
          wordWrap={false}
          afterChange={(changes, source) => {
            if (source === 'edit' && changes) {
              console.log(changes);
              const rowIndex = changes[0][0];
              const colIndex = changes[0][1];
              const value = changes[0][3];
              const editedData = spreadSheetData.map((row, index) => {
                if (index === rowIndex) {
                  return row.map((item: any, i: any) => {
                    if (i === colIndex) {
                      return value;
                    }
                    return item;
                  });
                }
                return row;
              });
              setSpreadSheetData(editedData);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home;
