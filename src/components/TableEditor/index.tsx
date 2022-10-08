// Components
import { Tooltip } from '@material-tailwind/react';

// Utils
import _ from 'lodash';
import cx from 'classnames';

// Icons
import { ExportCurve, LampOn, Lock1 } from 'iconsax-react';

// React
import { useState } from 'react';

// XLSX Utils
import { HotTable } from '@handsontable/react';

// Styles
import 'handsontable/dist/handsontable.full.css';

// Helpers
import exportAsXlsx from '../../Helpers/exportAsXlsx';

type tableEditorProps = {
  spreadSheetData: any;
  setSpreadSheetData: React.Dispatch<React.SetStateAction<any>>;
  fileName: string;
  sheetName: string;
};

const TableEditor = ({
  spreadSheetData,
  setSpreadSheetData,
  fileName,
  sheetName,
}: tableEditorProps) => {
  const [mode, setMode] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full gap-y-3">
      <div className="flex flex-row gap-x-2 items-center">
        <h1 className="text-white">Actions: </h1>
        <Tooltip content="Export" key={1}>
          <ExportCurve
            size="28"
            className="text-green-400 hover:animate-bounce cursor-pointer"
            onClick={() =>
              exportAsXlsx(spreadSheetData, fileName, sheetName)
            }
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
      <div id="hot-app" className="w-full">
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
              const rowIndex = changes[0][0];
              const colIndex = changes[0][1];
              const value = changes[0][3];
              const editedData = spreadSheetData.map(
                (row: [], index: number) => {
                  if (index === rowIndex) {
                    return row.map((item: any, i: any) => {
                      if (i === colIndex) {
                        return value;
                      }
                      return item;
                    });
                  }
                  return row;
                }
              );
              setSpreadSheetData(editedData);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TableEditor;
