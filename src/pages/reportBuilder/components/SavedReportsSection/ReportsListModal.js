import React from 'react';
import { connect } from 'react-redux';
import { MoreHoriz, Star } from '@sparkpost/matchbox-icons';
// TODO: Replace star with PushPin - why is PushPin not importing?
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

const allReportColumnHeaders = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', width: '25%', sortKey: 'modified' },
  { label: 'Created By', sortKey: 'creator' },
  {},
  {},
];

const myReportColumnHeaders = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Last Modification', sortKey: 'modified' },
  {},
];

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

const Actions = ({
  id,
  handleDelete,
  handlePin,
  handleEdit,
  reportType,
  report,
  pinnedReport,
  ...rest
}) => {
  return (
    <>
      {pinnedReport === report.id && <Star />}
      <Popover
        left
        top={rest.isLast}
        id={id}
        trigger={
          <Button variant="minimal" aria-controls={id} data-id={id} ml="200">
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
          <ActionList.Action content="Pin to Dashboard" onClick={() => handlePin(report)} />
          <ActionList.Action content="Edit" onClick={() => handleEdit(report)} />
        </ActionList>
      </Popover>
    </>
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
    pinnedReport,
    isScheduledReportsEnabled,
  } = props;

  const handleReportChange = report => {
    props.handleReportChange(report);
    onClose();
  };

  const myReports = reports.filter(({ creator }) => creator === currentUser);

  const myReportsColumns = report => {
    const { name, modified, isLast } = report;
    return [
      <Table.Cell>
        <ButtonLink
          onClick={() => {
            handleReportChange(report);
          }}
        >
          {name}
        </ButtonLink>
      </Table.Cell>,
      <Table.Cell>
        <div>{formatDateTime(modified)}</div>
      </Table.Cell>,
      <Table.Cell className="clearfix">
        <Actions
          isScheduledReportsEnabled={isScheduledReportsEnabled}
          id={`popover-myreports-${report.id}`}
          handleDelete={handleDelete}
          handlePin={handlePin}
          handleEdit={handleEdit}
          report={report}
          pinnedReport={pinnedReport}
          isLast={isLast}
        />
      </Table.Cell>,
    ];
  };
  const MyReportsRow = report => (
    <Table.Row>
      {myReportsColumns(report).forEach(column => (
        <column />
      ))}
    </Table.Row>
  );

  const allReportsColumns = report => {
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
      action,
    ];
  };
  const AllReportsRow = report => (
    <Table.Row>
      {allReportsColumns(report).forEach(column => (
        <column />
      ))}
    </Table.Row>
  );

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
              rowComponent={MyReportsRow}
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
              rowComponent={AllReportsRow}
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
    pinnedReport: selectCondition(isUserUiOptionSet('pinned_report'))(state),
    isScheduledReportsEnabled: selectCondition(isAccountUiOptionSet('allow_scheduled_reports'))(
      state,
    ),
  };
};
export default connect(mapStateToProps)(ReportsListModal);
