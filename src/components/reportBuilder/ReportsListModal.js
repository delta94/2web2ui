import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button, Modal, Radio, Tabs } from 'src/components/matchbox';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { updateUserUIOptions } from 'src/actions/currentUser';
import { showAlert } from 'src/actions/globalAlert';
import { MyReportsTab, AllReportsTab } from './ReportsListModalTabs';
export function ReportsListModal({
  reports,
  open,
  onClose,
  currentUser,
  handleDelete,
  handleEdit,
  isScheduledReportsEnabled,
  onDashboard,
  handleReportChange,
}) {
  const handleReportChangeAndClose = report => {
    handleReportChange(report);
    onClose();
  };

  const dispatch = useDispatch();

  const [tabIndex, setTabIndex] = useState(0);

  const [selectedReportId, setSelectedReportId] = useState(null);

  const handleRadioChange = id => setSelectedReportId(id);

  const onSubmit = () => {
    dispatch(updateUserUIOptions({ pinned_report: selectedReportId })).then(() => {
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
    if (!onDashboard) return <>{children}</>;

    return (
      <Radio.Group label="reportList" labelHidden>
        {children}
      </Radio.Group>
    );
  };

  const TABS = [
    <MyReportsTab
      reports={reports}
      currentUser={currentUser}
      onDashboard={onDashboard}
      handleRadioChange={handleRadioChange}
      selectedReportId={selectedReportId}
      handleReportChangeAndClose={handleReportChangeAndClose}
      isScheduledReportsEnabled={isScheduledReportsEnabled}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />,
    <AllReportsTab
      reports={reports}
      onDashboard={onDashboard}
      handleRadioChange={handleRadioChange}
      selectedReportId={selectedReportId}
      handleReportChangeAndClose={handleReportChangeAndClose}
      isScheduledReportsEnabled={isScheduledReportsEnabled}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />,
  ];

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>{onDashboard ? 'Change Report' : 'Saved Reports'}</Modal.Header>
      <Modal.Content>
        <ModalContentContainer>
          <Tabs
            tabs={[
              { content: 'My Reports', onClick: () => setTabIndex(0) },
              { content: 'All Reports', onClick: () => setTabIndex(1) },
            ]}
            fitted
            selected={tabIndex}
          />

          {TABS[tabIndex]}
        </ModalContentContainer>
      </Modal.Content>
      {onDashboard && (
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
      )}
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser.username,
    isScheduledReportsEnabled: selectCondition(isAccountUiOptionSet('allow_scheduled_reports'))(
      state,
    ),
  };
};
export default connect(mapStateToProps)(ReportsListModal);
