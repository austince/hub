import React from 'react';

import { VulnerabilitySeverity } from '../../../types';
import { SEVERITY_COLORS, SEVERITY_ORDER } from '../../../utils/data';
import sumObjectValues from '../../../utils/sumObjectValues';
import styles from './Summary.module.css';

interface Props {
  summary: {
    [key in VulnerabilitySeverity]: number;
  };
}

const VulnerabilitySummary = (props: Props) => {
  const total = sumObjectValues(props.summary);

  return (
    <div className="mb-5">
      <div className="h5 my-3">
        <span className="font-weight-bold">{total}</span> vulnerabilities have been detected in the{' '}
        <span className="font-weight-bold">default images</span> used by this package.
      </div>

      <div className="progress mb-4" style={{ height: '25px' }}>
        {SEVERITY_ORDER.map((severity: VulnerabilitySeverity) => {
          if (!props.summary.hasOwnProperty(severity)) return null;
          return (
            <div
              className="progress-bar text-dark px-1 font-weight-bold"
              role="progressbar"
              style={{
                width: `${(props.summary[severity] * 100) / total}%`,
                backgroundColor: SEVERITY_COLORS[severity],
              }}
            >
              <span className={`badge badge-pill badge-light text-center ${styles.badgeSummary}`}>
                {props.summary[severity]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VulnerabilitySummary;
