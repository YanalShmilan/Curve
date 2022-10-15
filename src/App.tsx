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
import Emails from './components/Emails/index';

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
              'Is GPA Probated?',
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
                className="flex btnActive items-center gap-2 animate-bounce"
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
              <Tab
                key={'emails'}
                value={'emails'}
                className="text-white"
              >
                Emails
              </Tab>
            </TabsHeader>
            <TabsBody
              animate={{
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              <TabPanel key={'home'} value={'home'}>
                <Home data={data} setSpreadSheetData={setSheetData} />
              </TabPanel>
              <TabPanel key={'sections'} value={'sections'}>
                <Sections
                  data={data.filter((student) => {
                    return student.Status !== 'Withdrawn';
                  })}
                  setSpreadSheetData={setSheetData}
                />
              </TabPanel>
              <TabPanel key={'charts'} value={'charts'}>
                <Charts
                  data={data.filter((student) => {
                    return student.Status !== 'Withdrawn';
                  })}
                />
              </TabPanel>
              <TabPanel key={'emails'} value={'emails'}>
                <Emails
                  data={data.filter((student) => {
                    return student.Status !== 'Withdrawn';
                  })}
                />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default App;
