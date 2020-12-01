import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { MoreHoriz, PushPin } from '@sparkpost/matchbox-icons';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { Tabs, TableCollection, Subaccount } from 'src/components';
import {
  ActionList,
  Box,
  Button,
  Modal,
  Popover,
  ScreenReaderOnly,
  Table,
  Tag,
} from 'src/components/matchbox';
import { formatDateTime } from 'src/helpers/date';
import { ButtonLink, PageLink } from 'src/components/links';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';

const DisabledAction = styled(ActionList.Action)`
  &[aria-disabled],
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const allReportColumnHeaders = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', width: '25%', sortKey: 'modified' },
  { label: 'Created By', sortKey: 'creator' },
  {},
  {},
  {},
];

const myReportColumnHeaders = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', sortKey: 'modified' },
  {},
  {},
];

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

const Icons = ({ report, pinnedReport }) => {
  let icons = [];
  if (pinnedReport && pinnedReport.id === report.id) {
    icons.push(<PushPin />);
  }
  return icons;
};

const Actions = ({ id, handleDelete, handlePin, handleEdit, reportType, report, ...rest }) => {
  let reportIsPinned = false;
  if (rest.pinnedReport) {
    reportIsPinned = rest.pinnedReport.id === report.id;
  }

  return (
    <Popover
      left
      top={rest.isLast}
      id={id}
      trigger={
        <Button variant="minimal" aria-controls={id} data-id={id}>
          <Button.Icon as={MoreHoriz} />
          <ScreenReaderOnly>Open Menu</ScreenReaderOnly>
        </Button>
      }
    >
      <ActionList>
        <ActionList.Action content="Delete" onClick={() => handleDelete(report)} />
        {rest.isScheduledReportsEnabled && (
          <ActionList.Action
            content="Schedule"
            to={`/signals/schedule/${report.id}`}
            as={PageLink}
          />
        )}
        <DisabledAction
          content="Pin to Dashboard"
          onClick={() => (reportIsPinned ? '' : handlePin(report, rest.pinnedReport))}
          disabled={reportIsPinned}
          aria-disabled={reportIsPinned}
        />
        <ActionList.Action content="Edit" onClick={() => handleEdit(report)} />
      </ActionList>
    </Popover>
  );
};

export function ReportsListModal(props) {
  const {
    reports,
    open,
    onClose,
    currentUser,
    handleDelete,
    handlePin,
    handleEdit,
    pinnedReportId,
    isScheduledReportsEnabled,
  } = props;

  const handleReportChange = report => {
    props.handleReportChange(report);
    onClose();
  };

  const myReports = reports.filter(({ creator }) => creator === currentUser);
  let pinnedReport;

  if (pinnedReportId) {
    pinnedReport = reports.find(report => report.id === pinnedReportId);
  }

  const myReportsColumns = report => {
    const { name, modified, isLast } = report;
    return [
      <ButtonLink
        onClick={() => {
          handleReportChange(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      <Icons report={report} pinnedReport={pinnedReport}></Icons>,
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-myreports-${report.id}`}
        handleDelete={handleDelete}
        handlePin={handlePin}
        handleEdit={handleEdit}
        report={report}
        pinnedReport={pinnedReport}
        isLast={isLast}
      />,
    ];
  };

  const allReportsColumns = report => {
    const { name, modified, creator, subaccount_id, current_user_can_edit, isLast } = report;
    const action = current_user_can_edit ? (
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-allreports-${report.id}`}
        handleDelete={handleDelete}
        handlePin={handlePin}
        handleEdit={handleEdit}
        report={report}
        pinnedReport={pinnedReport}
        isLast={isLast}
      />
    ) : (
      ''
    );

    return [
      <ButtonLink
        onClick={() => {
          handleReportChange(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      <div>{creator}</div>,
      <Tag>
        <Subaccount id={subaccount_id} master={subaccount_id === 0} shrinkLength={12} />
      </Tag>,
      <Icons report={report} pinnedReport={pinnedReport}></Icons>,
      action,
    ];
  };

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>Saved Reports</Modal.Header>
      <Modal.Content p="0">
        {/* Use p instead of padding due to bug in matchbox 4.3.1*/}
        <Tabs tabs={[{ content: 'My Reports' }, { content: 'All Reports' }]} forceRender fitted>
          <Tabs.Item>
            <TableCollection
              rows={myReports}
              columns={myReportColumnHeaders}
              getRowData={myReportsColumns}
              wrapperComponent={Table}
              filterBox={{
                label: '',
                show: true,
                itemToStringKeys: ['name', 'modified'],
                exampleModifiers: ['name', 'modified'],
                maxWidth: '1250',
                wrapper: FilterBoxWrapper,
              }}
            />
          </Tabs.Item>
          <Tabs.Item>
            <TableCollection
              rows={reports}
              columns={allReportColumnHeaders}
              getRowData={allReportsColumns}
              wrapperComponent={Table}
              filterBox={{
                label: '',
                show: true,
                itemToStringKeys: ['name', 'modified', 'creator'],
                exampleModifiers: ['name', 'modified', 'creator'],
                maxWidth: '1250',
                wrapper: FilterBoxWrapper,
              }}
            />
          </Tabs.Item>
        </Tabs>
      </Modal.Content>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser.username,
    pinnedReportId: selectCondition(isUserUiOptionSet('pinned_report_id'))(state),
    isScheduledReportsEnabled: selectCondition(isAccountUiOptionSet('allow_scheduled_reports'))(
      state,
    ),
  };
};
export default connect(mapStateToProps)(ReportsListModal);
