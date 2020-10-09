import { isNull } from 'lodash';
import React from 'react';
import { FaCheck } from 'react-icons/fa';

import { VulnerabilitySeverity } from '../../../types';
import { SEVERITY_COLORS, SEVERITY_ORDER } from '../../../utils/data';
import sumObjectValues from '../../../utils/sumObjectValues';
import SmallTitle from '../../common/SmallTitle';
import VulnerabilityModal from './Modal';
import styles from './VulnerabilityCard.module.css';

interface Props {
  className?: string;
  summary:
    | {
        [key in VulnerabilitySeverity]?: number;
      }
    | null;
}

const Vulnerability = (props: Props) => {
  if (isNull(props.summary)) return null;

  const total: number = sumObjectValues(props.summary || {});

  return (
    <div className={`card shadow-sm info mt-3 ${props.className}`}>
      <div className={`card-body ${styles.body}`}>
        <SmallTitle text="Security Report" />

        {total === 0 ? (
          <div className="text-center">
            <p>No vulnerabilities found</p>

            <FaCheck className="text-success" />
          </div>
        ) : (
          <>
            <div className="mt-2">
              {SEVERITY_ORDER.map((severity: VulnerabilitySeverity) => {
                if (!props.summary!.hasOwnProperty(severity)) return null;
                return (
                  <div
                    key={`summary_${severity}`}
                    className={`d-flex justify-content-between align-items-center pt-1 ${styles.summary}`}
                  >
                    <div className="d-flex flex-row align-items-center">
                      <span
                        className={`badge position-relative mr-2 ${styles.badge}`}
                        style={{ backgroundColor: SEVERITY_COLORS[severity] }}
                      >
                        {' '}
                      </span>
                      <span className={`text-uppercase ${styles.title}`}>{severity}</span>
                    </div>
                    <span className={`badge badge-pill ${styles.badgeItems}`}>{props.summary![severity]}</span>
                  </div>
                );
              })}
            </div>

            <div className="my-3">
              <VulnerabilityModal />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Vulnerability;
