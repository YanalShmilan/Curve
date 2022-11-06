import React from 'react';

import _ from 'lodash';
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Radio,
} from '@material-tailwind/react';

import cx from 'classnames';
import TableEditor from '../TableEditor';
import { utils, writeFile } from 'xlsx';

type Props = {
  data: any;
  examName: string;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const ExamDashboard = ({ data, examName, setData }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [requiredDocument, setRequiredDocument] =
    React.useState<string>();
  const [title, setTitle] = React.useState<string>();

  const handleOpen = () => setOpen(!open);

  // find the index of the exam
  const examIndex = data[0].findIndex(
    (item: string) => item === examName
  );
  // group students by their exam
  const groupedStudents = _.groupBy(
    data,
    (student: any) => student[examIndex]
  );
  // get the rooms
  const rooms: string[] = Object.keys(groupedStudents).filter(
    (e) => e !== '' && e !== examName
  );

  const [selectedRoom, setSelectedRoom] = React.useState(rooms[0]);

  const handleCreateDocument = () => {
    let documentHeader = [];
    let documentBody: any[] = [];

    const serialNumberIndex = data[0].findIndex(
      (item: string) => item === `${examName} - id`
    );
    const roomIndex = data[0].findIndex(
      (item: string) => item === examName
    );
    const studentIdIndex = data[0].findIndex(
      (item: string) => item === 'Student ID'
    );
    const studentNameIndex = data[0].findIndex(
      (item: string) => item === 'Student Name Arabic'
    );
    const instructionNameArabicIndex = data[0].findIndex(
      (item: string) => item === 'Instruction Name Arabic'
    );
    const SectionIndex = data[0].findIndex(
      (item: string) => item === 'Section'
    );

    if (requiredDocument === 'attendance') {
      documentHeader.push(
        'Serial number',
        'Student ID',
        'Student name',
        'Student Signature',
        'Teacher Signature'
      );
      documentBody = groupedStudents[selectedRoom].map(
        (student: any) => {
          return [
            student[serialNumberIndex],
            student[studentIdIndex],
            student[studentNameIndex],
            '',
            '',
          ];
        }
      );
    } else if (requiredDocument === 'students') {
      documentHeader.push(
        'Serial number',
        'Student ID',
        'Student name',
        'Instruction Name Arabic',
        'Section',
        'Room'
      );
      // remove first of data because it's the header
      const students = data.slice(1);

      documentBody = students.map((student: any) => {
        return [
          student[serialNumberIndex],
          student[studentIdIndex],
          student[studentNameIndex],
          student[instructionNameArabicIndex],
          student[SectionIndex],
          student[roomIndex],
        ];
      });
    }

    // set the column width to 20
    const ws = utils.aoa_to_sheet([
      [title],
      documentHeader,
      ...documentBody.sort((a, b) => a[0] - b[0]),
    ]);
    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
    ];
    // set the content alignment to left
    ws['!cols'].forEach((col: any) => {
      col.alignment = { horizontal: 'left' };
    });

    // set the header to the title
    ws['!merges'] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 4 },
      },
    ];
    ws['A1'].v = title;

    // set the header alignment to center
    ws['A1'].s = {
      alignment: { horizontal: 'center' },
      font: { sz: 20 },
    };

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${requiredDocument}.xlsx`);
  };
  console.log(rooms);

  return (
    <div>
      <div className="flex flex-row items-center text-white w-full gap-x-6 overflow-x-scroll">
        Rooms:{' '}
        {rooms.map((room: any) => {
          return (
            <div key={room} className="my-2 w-full">
              <Chip
                onTap={() => {
                  setSelectedRoom(room);
                }}
                className={cx('bg-gray-800 text-white', {
                  ' bg-blue-600 text-white': selectedRoom === room,
                })}
                animate={{
                  mount: { y: 0 },
                  unmount: { y: 50 },
                }}
                value={
                  room +
                  ' - ' +
                  groupedStudents[room].length +
                  ' students'
                }
              />
            </div>
          );
        })}
      </div>
      <Button className="btnActive mt-4" onClick={handleOpen}>
        Export
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Export</DialogHeader>
        <DialogBody divider className="flex flex-row flex-wrap gap-4">
          <Input
            placeholder="Title"
            label="Title"
            name="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Radio
            id="attendance"
            name="document"
            label="Attendance"
            onChange={() => {
              setRequiredDocument('attendance');
            }}
          />
          <Radio
            id="students"
            name="document"
            label="Students"
            onChange={() => {
              setRequiredDocument('students');
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            className="btnActive mr-1"
            variant="text"
            color="red"
            onClick={() => {
              handleOpen();
            }}
          >
            <span>Cancel</span>
          </Button>
          <Button
            className="btnActive"
            variant="gradient"
            color="green"
            onClick={() => {
              handleCreateDocument();
              handleOpen();
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <br />
      <div className="h-fit mt-4">
        <TableEditor
          spreadSheetData={groupedStudents[selectedRoom]}
          setSpreadSheetData={setData}
          fileName="Students"
          sheetName="Students"
        />
      </div>
      <Button>Attendence Sheet</Button>
    </div>
  );
};

export default ExamDashboard;
