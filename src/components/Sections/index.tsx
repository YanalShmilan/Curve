// Interfaces
import IStudent from '../../interfaces/IStudent';

// Utils
import _ from 'lodash';
import cx from 'classnames';

// React
import { useState } from 'react';

// Components
import TableEditor from '../TableEditor';
import { Chip } from '@material-tailwind/react';

type sectionsProps = {
  data: IStudent[];
  setSpreadSheetData: React.Dispatch<React.SetStateAction<any>>;
};

const Sections = ({ data, setSpreadSheetData }: sectionsProps) => {
  // @ts-ignore
  const sectionIndex = data[0].findIndex(
    (item: string) => item === 'Section'
  );

  // @ts-ignore
  const instructorNameIndex = data[0].findIndex(
    (item: string) => item === 'Instruction Name Arabic'
  );

  const dataBySection = _.groupBy(
    data,
    (student: any) => student[sectionIndex]
  ) as any;

  let sectionNumbers: any = [];

  // Removing empty sections
  if (Object.keys(dataBySection).length > 0) {
    // remove last element
    sectionNumbers = Object.keys(dataBySection).filter(
      (section) => section !== 'Section'
    );
  } else {
    sectionNumbers = Object.keys(dataBySection);
  }

  const [selectedSection, setSelectedSection] = useState<string>(
    sectionNumbers[0]
  );

  // filter data by section
  const filterdData = data.filter(
    (student: any) => student[sectionIndex] === selectedSection
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-6 overflow-x-scroll">
        {sectionNumbers.map((section: number) => {
          return (
            <div key={section} className="my-2 ">
              <Chip
                onTap={() => {
                  setSelectedSection(section.toString());
                }}
                className={cx('bg-gray-800 text-white', {
                  ' bg-blue-600 text-white':
                    selectedSection === section.toString(),
                })}
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 50 },
                }}
                value={
                  section +
                  ' - ' +
                  dataBySection[section][0][instructorNameIndex]
                }
              />
            </div>
          );
        })}
      </div>
      <TableEditor
        spreadSheetData={filterdData}
        setSpreadSheetData={setSpreadSheetData}
        fileName="Students"
        sheetName="Students"
      />
    </div>
  );
};

export default Sections;
