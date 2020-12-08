import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Modal, Radio, Tabs } from 'src/components/matchbox';
import { updateUserUIOptions } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import {
  MyReportsTabWithSelectableRows,
  AllReportsTabWithSelectableRows,
} from './ReportsListModalTabs';
export function ChangeReportModal({ reports, open, onClose, currentUser }) {
  const dispatch = useDispatch();

  const [tabIndex, setTabIndex] = useState(0);

  const [selectedReportId, setSelectedReportId] = useState(null);

  const [searchedText, setSearchedText] = useState('');

  const handleRadioChange = id => setSelectedReportId(id);

  const handleTabChange = index => {
    handleRadioChange(null);
    setTabIndex(index);
  };

  const onSubmit = () => {
    dispatch(updateUserUIOptions({ pinned_report_id: selectedReportId })).then(() => {
      dispatch(
        showAlert({
          type: 'success',
          message: 'Pinned Report updated',
        }),
      );
    });

    onClose();
  };

  const ModalContentContainer = ({ children }) => {
    return (
      <Radio.Group label="reportList" labelHidden>
        {children}
      </Radio.Group>
    );
  };

  const TABS = [
    <MyReportsTabWithSelectableRows
      reports={reports}
      currentUser={currentUser}
      handleRadioChange={handleRadioChange}
      selectedReportId={selectedReportId}
      searchedText={searchedText}
      setSearchedText={setSearchedText}
    />,
    <AllReportsTabWithSelectableRows
      reports={reports}
      handleRadioChange={handleRadioChange}
      selectedReportId={selectedReportId}
      searchedText={searchedText}
      setSearchedText={setSearchedText}
    />,
  ];

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>Change Report</Modal.Header>
      <Modal.Content>
        <ModalContentContainer>
          <Tabs
            tabs={[
              { content: 'My Reports', onClick: () => handleTabChange(0) },
              { content: 'All Reports', onClick: () => handleTabChange(1) },
            ]}
            fitted
            selected={tabIndex}
          />

          {TABS[tabIndex]}
        </ModalContentContainer>
      </Modal.Content>
      <Modal.Footer>
        <Button
          variant="primary"
          loadingLabel="Loading"
          onClick={onSubmit}
          disabled={!selectedReportId}
        >
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
