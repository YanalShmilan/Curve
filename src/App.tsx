// Components
import {
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
import Home from './components/Home';

// Icons
import { AddSquare } from 'iconsax-react';

// React
import { useRef, useState } from 'react';

// XLSX
import { read, utils } from 'xlsx';

// Types
import IStudent from './interfaces/IStudent';
import Sections from './components/Sections';

// Utils
import _ from 'lodash';
import Charts from './components/Charts';

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<IStudent[]>([]);
  const [sheetData, setSheetData] = useState<any>();

  const handleFile = async () => {
    if (fileInput.current) {
      const currentFile = fileInput.current.files?.[0];
      if (currentFile) {
        const fileName = await currentFile.arrayBuffer();
        const sheet = read(fileName);
        const sheetName = sheet.SheetNames[0];
        setSheetData({
          sheetName,
          fileName: currentFile.name,
        });
        const sheetData = utils.sheet_to_json<IStudent>(
          sheet.Sheets[sheetName],
          {
            header: [
              'Serial No#',
              'Student ID',
              'Student Name Arabic',
              'Student Gender',
              'Email Address',
              'Section',
              'Instruction Name Arabic',
              'GPA',
              'Credit Registered',
              'Repeat Count',
              'Probation Count',
              'Major',
              'Status',
              'Nationality',
            ],
            defval: '',
          }
        );

        setData(sheetData);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* If there is not excel file, show uploade button */}
      {data.length === 0 ? (
        <div className="h-screen flex w-full">
          <div className="m-auto">
            <input
              ref={fileInput}
              type="file"
              accept=".xls,.xlsx,application/msexcel,application"
              className="hidden"
              id="contained-button-file"
              onChange={handleFile}
            />
            <label htmlFor="contained-button-file">
              <Button
                className="flex items-center gap-2 animate-bounce"
                onClick={() => fileInput?.current?.click()}
              >
                <AddSquare />
                Upload Excel File
              </Button>
            </label>
          </div>
        </div>
      ) : (
        // If there is excel file, show tabs
        <div className="w-full px-16 mx-auto mt-16">
          <Tabs id="custom-animation" value="home">
            <TabsHeader
              className="bg-gray-700"
              indicatorProps={{
                className: 'bg-blue-500',
              }}
            >
              <Tab key={'home'} value={'home'} className="text-white">
                Home
              </Tab>
              <Tab
                key={'sections'}
                value={'sections'}
                className="text-white"
              >
                Sections
              </Tab>
              <Tab
                key={'charts'}
                value={'charts'}
                className="text-white"
              >
                Charts
              </Tab>
            </TabsHeader>
            <TabsBody
              animate={{
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              <TabPanel key={'home'} value={'home'}>
                <Home
                  data={data}
                  setSpreadSheetData={setSpreadSheetData}
                />
              </TabPanel>
              <TabPanel key={'sections'} value={'sections'}>
                <Sections
                  data={data}
                  setSpreadSheetData={setSpreadSheetData}
                />
              </TabPanel>
              <TabPanel key={'charts'} value={'charts'}>
                <Charts data={data} />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default App;
