import { identity, pickBy } from 'lodash';

export default (data: { [key: string]: number | undefined }): number => {
  const cleanData = pickBy(data, identity);
  return Object.values(cleanData).reduce((a, b) => a! + b!) || 0;
};
