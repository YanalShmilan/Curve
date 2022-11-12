// Components
import {
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';
import { ToastContainer, toast } from 'react-toastify';
import Home from './components/Home';

// Styles
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { AddSquare } from 'iconsax-react';

// React
import { useEffect, useRef, useState } from 'react';

// XLSX
import { read, utils } from 'xlsx';

// Types
import IStudent from './interfaces/IStudent';
import Sections from './components/Sections';

// Utils
import Charts from './components/Charts';
import Emails from './components/Emails/index';
import Exams from './components/Exams';

function App() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<any[]>([]);

  const handleFile = async () => {
    if (fileInput.current) {
      const currentFile = fileInput.current.files?.[0];
      if (currentFile) {
        const fileName = await currentFile.arrayBuffer();
        const sheet = read(fileName);
        const sheetName = sheet.SheetNames[0];
        const sheetData = utils.sheet_to_json<IStudent>(
          sheet.Sheets[sheetName],
          {
            header: 1,
          }
        );
        const filteredData = sheetData.filter((row: any) => {
          if (row[0] !== undefined) {
            return row;
          }
        });
        // sort data by index 0
        const sortedData = filteredData.sort((a: any, b: any) => {
          if (a[0] < b[0]) {
            return -1;
          }
          if (a[0] > b[0]) {
            return 1;
          }
          return 0;
        });
        setData(sortedData);
      }
    }
  };

  // every setDAta call will trigger this useEffect
  useEffect(() => {
    toast.warning('Data has been updated, please export again');
  }, [data]);

  // @ts-ignore
  const statusIndex = data[0]?.findIndex(
    (item: string) => item === 'Status'
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
          <ToastContainer />
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
              <Tab
                key={'exams'}
                value={'exams'}
                className="text-white"
              >
                Exams
              </Tab>
            </TabsHeader>
            <TabsBody
              animate={{
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              <TabPanel key={'home'} value={'home'}>
                <Home data={data} setSpreadSheetData={setData} />
              </TabPanel>
              <TabPanel key={'sections'} value={'sections'}>
                <Sections
                  data={data.filter((student: any) => {
                    return student[statusIndex] !== 'Withdrawn';
                  })}
                  setSpreadSheetData={setData}
                />
              </TabPanel>
              <TabPanel key={'charts'} value={'charts'}>
                <Charts
                  data={data.filter((student: any) => {
                    return student[statusIndex] !== 'Withdrawn';
                  })}
                />
              </TabPanel>
              <TabPanel key={'emails'} value={'emails'}>
                <Emails
                  data={data.filter((student: any) => {
                    return student[statusIndex] !== 'Withdrawn';
                  })}
                />
              </TabPanel>
              <TabPanel key={'exams'} value={'exams'}>
                <Exams
                  data={data.filter((student: any) => {
                    return student[statusIndex] !== 'Withdrawn';
                  })}
                  setData={setData}
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
