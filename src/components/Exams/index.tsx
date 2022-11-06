import React from 'react';
import IStudent from '../../interfaces/IStudent';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Radio,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from '@material-tailwind/react';

import _ from 'lodash';
import ExamDashboard from './ExamDashboard';

type Props = {
  data: IStudent[];
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const Exams = ({ data, setData }: Props) => {
  const [examData, setExamData] = React.useState({
    examName: 'First',
    questions: 0,
    rooms: [],
  });

  const currentExams = (): string[] => {
    const exams = [];
    // @ts-ignore
    if (data[0].includes('First')) {
      exams.push('First');
    }
    // @ts-ignore
    if (data[0].includes('Second')) {
      exams.push('Second');
    }
    // @ts-ignore
    if (data[0].includes('Final')) {
      exams.push('Final');
    }
    return exams;
  };

  const addRoomField = () => {
    setExamData({
      ...examData,
      rooms: [...examData.rooms, { room: '', capacity: 0 }] as any,
    });
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const handleAddExam = () => {
    // randomize students and add them to rooms and add an id to each student
    const studentsList = data.filter(
      (student: any) => student[0] !== 'Serial No#'
    );
    const randomizedStudents = _.shuffle(studentsList);
    const questions: any = [];
    for (let i = 0; i < examData.questions; i++) {
      questions.push(`${examData.examName} - Q${i + 1}`);
    }

    const rooms: any = examData.rooms.map((room: any, i: number) => {
      const students = randomizedStudents.splice(0, room.capacity);
      return {
        ...room,
        students: students.map((student: any, index: number) => [
          ...student,
          room.room,
          // id is the last room length + the index of the student in the room , starting from 1
          examData.rooms
            .slice(0, i)
            .reduce(
              (acc: number, room: any) => acc + room.capacity,
              0
            ) +
            (index + 1),
          ...questions.map((question: string) => ''),
        ]),
      };
    });

    // flatten the rooms
    const flattenedRooms = rooms.reduce(
      (acc: any, room: any) => [...acc, ...room.students],
      []
    );

    const header = [
      // @ts-ignore
      ...data[0],
      examData.examName,
      `${examData.examName} - id`,
      ...questions.map(
        (q: any, i: any) => `${examData.examName} - ${i}`
      ),
    ];

    setData([header, ...flattenedRooms]);
  };

  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add a new exam.</DialogHeader>
        <DialogBody divider className="flex flex-row flex-wrap gap-4">
          <Radio
            id="first"
            name="type"
            label="First"
            disabled={data[0].First !== undefined}
            onChange={() => {
              setExamData({
                ...examData,
                examName: 'First',
              });
            }}
          />
          <Radio
            id="second"
            name="type"
            label="Second"
            disabled={data[0].Second !== undefined}
            onChange={() => {
              setExamData({
                ...examData,
                examName: 'Second',
              });
            }}
          />
          <Radio
            id="final"
            name="type"
            label="Final"
            disabled={data[0].Final !== undefined}
            onChange={() => {
              setExamData({
                ...examData,
                examName: 'Final',
              });
            }}
          />
          <br />
          <Input
            label="Questions no"
            type={'number'}
            onChange={(e) =>
              setExamData({ ...examData, questions: +e.target.value })
            }
          />
          {examData.rooms.map((room: any, index: number) => (
            <div key={index} className="flex flex-col gap-4">
              <Input
                required
                type={'text'}
                value={room.room}
                label="Room"
                onChange={(e) => {
                  const newRooms = examData.rooms;
                  // @ts-ignore
                  newRooms[index].room = e.target.value;
                  setExamData({ ...examData, rooms: newRooms });
                }}
              />
              <Input
                required
                type={'number'}
                value={room.capacity}
                label="Capacity"
                onChange={(e) => {
                  const newRooms = examData.rooms;
                  // @ts-ignore
                  newRooms[index].capacity = +e.target.value;
                  setExamData({ ...examData, rooms: newRooms });
                }}
              />
              {/* <Input
                required
                type={'text'}
                value={room.floor}
                label="Floor"
                onChange={(e) => {
                  const newRooms = examData.rooms;
                  // @ts-ignore
                  newRooms[index].floor = e.target.value;
                  setExamData({ ...examData, rooms: newRooms });
                }}
              /> */}
              {/* <Input
                required
                type={'text'}
                value={room.building}
                label="Building"
                onChange={(e) => {
                  const newRooms = examData.rooms;
                  // @ts-ignore
                  newRooms[index].building = e.target.value;
                  setExamData({ ...examData, rooms: newRooms });
                }}
              /> */}
            </div>
          ))}
          <Button className="btnActive h-fit" onClick={addRoomField}>
            Add a room
          </Button>
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
              handleAddExam();
              handleOpen();
            }}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="flex flex-row gap-4">
        <Button className="btnActive" onClick={handleOpen}>
          Add Exam
        </Button>
      </div>
      <Tabs id="custom-animation" value="first">
        <TabsHeader
          className="bg-gray-700 mt-8"
          indicatorProps={{
            className: 'bg-blue-500',
          }}
        >
          {currentExams().map((exam) => (
            <Tab key={exam} value={exam} className="text-white">
              {exam}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {currentExams().map((exam) => (
            <TabPanel key={exam} value={exam}>
              <ExamDashboard
                data={data.filter((i: any) => i[exam] !== exam)}
                examName={exam}
                setData={setData}
              />
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default Exams;
