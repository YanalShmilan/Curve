// Interfaces
import IStudent from '../../interfaces/IStudent';

// Utils
import _ from 'lodash';
import cx from 'classnames';
import ReactToPrint from 'react-to-print';
// React
import React, { useRef, useState } from 'react';

// Components
import { Button, Card, Chip } from '@material-tailwind/react';
import ProbationRepeatChart from '../ProbationRepeatChart';
import DepartmentsChart from '../DepartmentsChart';
import GpaChart from '../GpaChart';
import GenderChart from '../GenderChart';

type chartsProps = {
  data: IStudent[];
};

const Charts = ({ data }: chartsProps) => {
  const dataBySection = _.groupBy(data, 'Section') as any;

  let sectionNumbers: any = [];

  // Removing empty sections
  if (Object.keys(dataBySection).length > 0) {
    sectionNumbers = Object.keys(dataBySection).filter(
      (section) => section !== 'Section'
    );
  } else {
    sectionNumbers = Object.keys(dataBySection);
  }

  const [selectedSection, setSelectedSection] = useState<number>(0);

  // filter data by section
  const filterdData =
    selectedSection === 0
      ? data
      : data.filter((item) => item.Section == selectedSection);

  const getPageMargins = () => {
    return `@page { margin: 20 20 20 20 !important; }`;
  };
  const componentRef = useRef(null);
  return (
    <div className="flex flex-col gap-y-4 ">
      <div className="flex flex-row justify-left gap-x-6 overflow-x-scroll items-center">
        <Chip
          onTap={() => {
            setSelectedSection(0);
          }}
          className={cx('bg-gray-800 text-white h-fit', {
            ' bg-blue-600 text-white': selectedSection == 0,
          })}
          animate={{
            mount: { y: 0 },
            unmount: { y: 50 },
          }}
          value="All"
        />
        {sectionNumbers.map((section: number) => {
          return (
            <div key={section} className="my-2 w-full">
              <Chip
                onTap={() => {
                  setSelectedSection(section);
                }}
                className={cx('bg-gray-800 text-white', {
                  ' bg-blue-600 text-white':
                    selectedSection == section,
                })}
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 50 },
                }}
                value={
                  section +
                  ' - ' +
                  dataBySection[section][0]['Instruction Name Arabic']
                }
              />
            </div>
          );
        })}
      </div>
      {/* <div onClick={exportAsPdf}>Export As Pdf</div> */}
      <ReactToPrint
        trigger={() => (
          <Button className="w-fit mx-auto animate-pulse">
            Print this out!
          </Button>
        )}
        content={() => componentRef.current}
      />
      <Card
        ref={componentRef}
        className="grid grid-cols-2 mt-2 w-[29.7cm] gap-y-2 h-[19.5cm] mx-auto"
      >
        <div className="col-span-2 h-28 w-full">
          <div className=" py-2 pl-4 pr-7 w-full flex flex-row gap-4">
            <img
              className="object-contain h-20"
              src={require('../../assets/kwlogo.png')}
            />
            <div className="flex flex-col h-full gap-3 w-full">
              <input
                className="text-md font-bold text-gray-800"
                placeholder="Kuwait University | College of Engineering and
                Petroleum | Electrical Engineering Department"
              />
              <input
                className="
              text-4xl font-bold text-gray-800 px-2
              "
                placeholder="ENGR 205 Spring 2022 Dashboard"
              />
            </div>
            <Card>
              <div className="flex font-bold flex-col text-lg h-full p-2 items-center justify-center ">
                {filterdData.length}
                <h1 className=" font-normal text-gray-800">
                  Students
                </h1>
              </div>
            </Card>
            <Card>
              <div className="flex font-bold flex-col text-lg h-full p-2 items-center justify-center ">
                {selectedSection == 0
                  ? sectionNumbers.length
                  : selectedSection}
                <h1 className=" font-normal text-gray-800">
                  {selectedSection == 0 ? 'Sections' : 'Section'}
                </h1>
              </div>
            </Card>
          </div>
        </div>
        <div>
          <ProbationRepeatChart data={filterdData} />
        </div>
        <div className="px-3">
          <DepartmentsChart data={filterdData} />
        </div>
        <div className="">
          <GpaChart data={filterdData} />
        </div>
        <div className="px-3 ">
          <GenderChart data={filterdData} />
        </div>
      </Card>
    </div>
  );
};

export default Charts;
