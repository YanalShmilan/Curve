// Interfaces
import IStudent from '../../interfaces/IStudent';

// Utils
import _ from 'lodash';
import cx from 'classnames';

// React
import React, { useState } from 'react';

// Components
import { Chip } from '@material-tailwind/react';
import ProbationRepeatChart from '../ProbationRepeatChart';
import DepartmentsChart from '../DepartmentsChart';
import GpaChart from '../GpaChart';
import GenderChart from '../GenderChart';
import exportAsPdf from '../../Helpers/exportAsPdf';

type chartsProps = {
  data: IStudent[];
};

const Charts = ({ data }: chartsProps) => {
  const dataBySection = _.groupBy(data, 'Section') as any;

  let sectionNumbers: any = [];

  // Removing empty sections
  if (Object.keys(dataBySection).length > 0) {
    sectionNumbers = Object.keys(dataBySection).slice(0, -1);
  } else {
    sectionNumbers = Object.keys(dataBySection);
  }

  const [selectedSection, setSelectedSection] = useState<number>(0);

  // filter data by section
  const filterdData =
    selectedSection === 0
      ? data
      : data.filter((item) => item.Section == selectedSection);

  return (
    <div className="flex flex-col gap-y-4">
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
      <div className="grid grid-cols-2 mt-12 gap-y-12" id="capture">
        <div>
          <ProbationRepeatChart data={filterdData} />
        </div>
        <div className="px-3">
          <DepartmentsChart data={filterdData} />
        </div>
        <div>
          <GpaChart data={filterdData} />
        </div>
        <div className="px-3">
          <GenderChart data={filterdData} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
