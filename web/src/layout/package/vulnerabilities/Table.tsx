import React, { useState } from 'react';
import { FaCaretDown, FaCaretRight } from 'react-icons/fa';

import { Vulnerability, VulnerabilityTargetReport } from '../../../types';
import formatVulnerabilitiesReport from '../../../utils/formatVulnerabilitiesReport';
import VulnerabilityCell from './Cell';
import styles from './Table.module.css';

interface Props {
  image: string;
  reports: VulnerabilityTargetReport[];
}

const VulnerabilityTable = (props: Props) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className="my-1">
      <button className="btn btn-link text-reset pl-0 h5" onClick={() => setExpanded(!expanded)}>
        <div className="d-flex flex-row align-items-center font-weight-bold">
          {expanded ? <FaCaretDown /> : <FaCaretRight />}
          <div className="ml-2">
            <span className={`text-uppercase text-muted mr-2 ${styles.tableTitle}`}>Image:</span>
            {props.image}
          </div>
        </div>
      </button>

      {expanded && (
        <>
          {props.reports.map((item: VulnerabilityTargetReport) => {
            const sortedVulnerabilities = item.Vulnerabilities ? formatVulnerabilitiesReport(item.Vulnerabilities) : [];

            return (
              <div className="ml-4 mb-4">
                <div className={`${styles.tableTitle} font-weight-bold mr-2 mb-2`}>
                  <span className="text-uppercase text-muted mr-2">Target:</span>
                  <span className="font-weight-bold">{item.Target}</span>
                </div>
                {sortedVulnerabilities.length === 0 ? (
                  <span className="font-italic text-muted">No vulnerabilities found</span>
                ) : (
                  <table className={`table table-sm ${styles.table}`}>
                    <thead>
                      <tr className="text-uppercase text-muted">
                        <th scope="col" className={`border-top-0 ${styles.fitCell}`} />
                        <th scope="col" className="border-top-0">
                          ID
                        </th>
                        <th scope="col" className="border-top-0">
                          Severity
                        </th>
                        <th scope="col" className="border-top-0">
                          Package
                        </th>
                        <th scope="col" className="border-top-0">
                          Version
                        </th>
                        <th scope="col" className="border-top-0">
                          Fixed in
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedVulnerabilities.map((item: Vulnerability) => (
                        <VulnerabilityCell vulnerability={item} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default VulnerabilityTable;
