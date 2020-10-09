import React, { useState } from 'react';
import { HiClipboardList } from 'react-icons/hi';

import { VulnerabilityReport } from '../../../types';
import alertDispatcher from '../../../utils/alertDispatcher';
import Modal from '../../common/Modal';
import styles from './Modal.module.css';
import VulnerabilitySummary from './Summary';
import VulnerabilityTable from './Table';

const VulnerabilityModal = () => {
  const [openStatus, setOpenStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<VulnerabilityReport | null | undefined>();

  async function getVulnerabilityReports() {
    try {
      setIsLoading(true);
      // TODO - get full reposrt from API
      setReport(require('./vulnerabilityResults.json') as VulnerabilityReport);
      setIsLoading(false);
      setOpenStatus(true);
    } catch {
      setReport(null);
      alertDispatcher.postAlert({
        type: 'danger',
        message: 'An error occurred getting the vulnerability reports, please try again later.',
      });
      setIsLoading(false);
    }
  }

  const onOpenModal = () => {
    if (report) {
      setOpenStatus(true);
    } else {
      getVulnerabilityReports();
    }
  };

  return (
    <>
      <div className="text-center">
        <button className="btn btn-secondary btn-sm" onClick={onOpenModal}>
          <small className="d-flex flex-row align-items-center text-uppercase">
            {isLoading ? (
              <>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />
                <span className="ml-2">Getting report...</span>
              </>
            ) : (
              <>
                <HiClipboardList className="mr-2" />
                <span>See full report</span>
              </>
            )}
          </small>
        </button>
      </div>

      {openStatus && report && (
        <Modal
          modalDialogClassName={styles.modalDialog}
          header={<div className={`h3 m-2 ${styles.title}`}>Security report</div>}
          onClose={() => setOpenStatus(false)}
          open={openStatus}
        >
          <div className="m-3">
            <div className="h5 mt-0 text-secondary text-uppercase font-weight-bold mb-2">Summary</div>
            <VulnerabilitySummary summary={report.summary} />

            <div className="h5 mt-0 text-secondary text-uppercase font-weight-bold mb-2">Vulnerabilities</div>
            <div className="mt-3">
              {Object.keys(report.full).map((image: string) => {
                return <VulnerabilityTable image={image} reports={report.full[image]} key={`image_${image}`} />;
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default VulnerabilityModal;
