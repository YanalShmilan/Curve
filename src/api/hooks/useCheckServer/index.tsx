import instance from '../../common/instance';

export const checkServer = async () => {
  const { data } = await instance.get(`/check`);

  return data;
};
