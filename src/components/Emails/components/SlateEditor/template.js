const testTemplate = [
  {
    type: 'paragaph',
    children: [{ text: 'Dear {{STUDENT_NAME}},' }],
  },
  { type: 'paragaph', children: [{ text: '' }] },
  {
    type: 'paragaph',
    children: [
      {
        text: 'This is just a test email to make sure that the automated email function works properly.',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'Please add this email to your contacts to ensure all future emails are sent to your inbox.',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'Please don’t send emails to this account. Use my KU email (',
      },
      {
        text: 'abeer.almaimouni@ku.edu.kw',
        bold: true,
      },
      { text: ')' },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'or Ms. Teams should you need to reach out to me.',
      },
    ],
  },
  { type: 'paragaph', children: [{ text: '' }] },
  {
    type: 'paragaph',
    children: [
      {
        text: 'The coordinator of the ENGR 205 course,',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [{ text: 'Dr. Abeer Almaimouni' }],
  },
];

const firstTemplate = [
  {
    type: 'paragaph',
    children: [
      {
        text: 'Dear {{STUDENT_NAME}}',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'See below for the information you will need for Exam 1. Exam 1 will take place on Saturday,',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'November 19, 2022, from 2:00pm to 3:30pm. The exam will take place in the south building of the',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: 'College of Engineering, on the fourth floor.',
      },
    ],
  },
  {
    type: 'paragaph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam Serial No',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student ID',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student Name',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam room',
              },
            ],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: '{{FIRST_SERIAL}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_ID}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_NAME}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{FIRST_ROOM}}',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Also, ensure you carefully read the exam instructions that have been posted in Teams.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Good luck with the exam!',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'The coordinator for the EE205 course,',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Dr. Abeer Almaimouni#',
      },
    ],
  },
];

const secondTemplate = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Dear {{STUDENT_NAME}}',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'See below for the information you will need for Exam 2. Exam 2 will take place on Saturday,',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'December 17, 2022, from 2:00pm to 3:30pm. The exam will take place in the south building of the',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'College of Engineering, on the fourth floor.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam Serial No',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student ID',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student Name',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam room',
              },
            ],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: '{{SECOND_SERIAL}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_ID}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_NAME}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{SECOND_ROOM}}',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Also, ensure you carefully read the exam instructions that have been posted in Teams.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Good luck with the exam!',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'The coordinator for the EE205 course,',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Dr. Abeer Almaimouni#',
      },
    ],
  },
];

const finalTemplate = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Dear {{STUDENT_NAME}}',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'See below for the information you will need for the final exam. The final exam will take place',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'on Saturday, December 17, 2022, from 2:00pm to 3:30pm. The exam will take place in the south',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'building of the College of Engineering, on the fourth floor.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'table',
    children: [
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam Serial No',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student ID',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Student Name',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: 'Exam room',
              },
            ],
          },
        ],
      },
      {
        type: 'table-row',
        children: [
          {
            type: 'table-cell',
            children: [
              {
                text: '{{FINAL_SERIAL}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_ID}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{STUDENT_NAME}}',
              },
            ],
          },
          {
            type: 'table-cell',
            children: [
              {
                text: '{{FINAL_ROOM}}',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Also, ensure you carefully read the exam instructions that have been posted in Teams.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Good luck with the exam!',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'The coordinator for the EE205 course,',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Dr. Abeer Almaimouni#',
      },
    ],
  },
];

const templates = {
  test: testTemplate,
  first: firstTemplate,
  second: secondTemplate,
  final: finalTemplate,
};

export default templates;
