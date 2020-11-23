import React from 'react';
import { connect } from 'react-redux';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
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

const allReportsColumns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', width: '25%', sortKey: 'modified' },
  { label: 'Created By', sortKey: 'creator' },
  {},
  {},
];

const myReportsColumns = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', sortKey: 'modified' },
  {},
];

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

const Actions = ({ id, handleDelete, handlePin, handleEdit, reportType, report, ...rest }) => {
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
        <ActionList.Action content="Pin On Dashboard" onClick={() => handlePin(report)} />
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
    isScheduledReportsEnabled,
  } = props;
  const handleReportChange = report => {
    props.handleReportChange(report);
    onClose();
  };

  const myReports = reports.filter(({ creator }) => creator === currentUser);

  const myReportsRows = report => {
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
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-myreports-${report.id}`}
        handleDelete={handleDelete}
        handlePin={handlePin}
        handleEdit={handleEdit}
        report={report}
        isLast={isLast}
      />,
    ];
  };

  const allReportsRows = report => {
    const { name, modified, creator, subaccount_id, current_user_can_edit, isLast } = report;
    //conditionally render the actionlist
    const action = current_user_can_edit ? (
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-allreports-${report.id}`}
        handleDelete={handleDelete}
        handlePin={handlePin}
        handleEdit={handleEdit}
        report={report}
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
              headerComponent={() => null}
              rows={myReports}
              columns={myReportsColumns}
              getRowData={myReportsRows}
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
              headerComponent={() => null}
              rows={reports}
              columns={allReportsColumns}
              getRowData={allReportsRows}
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
    isScheduledReportsEnabled: selectCondition(isAccountUiOptionSet('allow_scheduled_reports'))(
      state,
    ),
  };
};
export default connect(mapStateToProps)(ReportsListModal);
