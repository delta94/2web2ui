import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs } from 'src/components/matchbox';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { MyReportsTab, AllReportsTab } from './ReportsListModalTabs';
export function ReportsListModal({
  reports,
  open,
  onClose,
  currentUser,
  handleDelete,
  handleEdit,
  isScheduledReportsEnabled,
  handleReportChange,
}) {
  const handleReportChangeAndClose = report => {
    handleReportChange(report);
    onClose();
  };

  const [tabIndex, setTabIndex] = useState(0);

  const ModalContentContainer = ({ children }) => {
    return <>{children}</>;
  };

  const TABS = [
    <MyReportsTab
      reports={reports}
      currentUser={currentUser}
      handleReportChangeAndClose={handleReportChangeAndClose}
      isScheduledReportsEnabled={isScheduledReportsEnabled}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />,
    <AllReportsTab
      reports={reports}
      handleReportChangeAndClose={handleReportChangeAndClose}
      isScheduledReportsEnabled={isScheduledReportsEnabled}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
    />,
  ];

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>Saved Reports</Modal.Header>
      <Modal.Content p="0">
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
