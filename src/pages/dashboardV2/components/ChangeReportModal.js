import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Modal, Tabs } from 'src/components/matchbox';
import { updateUserUIOptions } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import {
  MyReportsTabWithSelectableRows,
  AllReportsTabWithSelectableRows,
} from './ChangeReportModalTabs';
export function ChangeReportModal({ reports, open, onClose, currentUser }) {
  const dispatch = useDispatch();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = index => {
    setTabIndex(index);
  };

  const onSubmit = val => {
    if (val.reportId) {
      dispatch(updateUserUIOptions({ pinned_report_id: val.reportId })).then(() => {
        dispatch(
          showAlert({
            type: 'success',
            message: 'Pinned Report updated',
          }),
        );
      });

      onClose();
    }
  };

  const TABS = [
    <MyReportsTabWithSelectableRows
      reports={reports}
      currentUser={currentUser}
      onSubmit={onSubmit}
    />,
    <AllReportsTabWithSelectableRows reports={reports} onSubmit={onSubmit} />,
  ];

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>Change Report</Modal.Header>
      <Modal.Content p="0">
        <Tabs
          tabs={[
            { content: 'My Reports', onClick: () => handleTabChange(0) },
            { content: 'All Reports', onClick: () => handleTabChange(1) },
          ]}
          fitted
          selected={tabIndex}
        />

        {TABS[tabIndex]}
      </Modal.Content>
      <Modal.Footer>
        <Button variant="primary" loadingLabel="Loading" type="submit" form="reportsmodalForm">
          Change Report
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser.username,
  };
};
export default connect(mapStateToProps)(ChangeReportModal);
