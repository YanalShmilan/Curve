import instance from '../../common/instance';

type SendEmailProps = {
  email: string;
  subject: string;
  html: string;
};

export const sendEmail = async (email: SendEmailProps) => {
  const { data } = await instance.post(`/send`, {
    ...email,
  });

  return data;
};
