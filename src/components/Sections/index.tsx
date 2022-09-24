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
  const dataBySection = _.groupBy(data, 'Section') as any;

  let sectionNumbers: any = [];

  // Removing empty sections
  if (Object.keys(dataBySection).length > 0) {
    sectionNumbers = Object.keys(dataBySection).slice(0, -1);
  } else {
    sectionNumbers = Object.keys(dataBySection);
  }

  const [selectedSection, setSelectedSection] = useState<number>(
    sectionNumbers[0]
  );

  // filter data by section
  const filterdData = data.filter(
    (item) => item.Section == selectedSection
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row justify-left gap-x-6 overflow-x-scroll">
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
