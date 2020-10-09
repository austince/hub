import { orderBy } from 'lodash';

import { Vulnerability } from '../types';
import { SEVERITY_ORDER } from './data';

export default (vulnerabilities: Vulnerability[]): Vulnerability[] => {
  return orderBy(
    vulnerabilities,
    [(vulnerability: Vulnerability) => SEVERITY_ORDER.indexOf(vulnerability.Severity)],
    ['asc']
  );
};
