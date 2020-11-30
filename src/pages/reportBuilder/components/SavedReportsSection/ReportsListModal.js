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
  Radio,
  ScreenReaderOnly,
  Table,
  Tag,
} from 'src/components/matchbox';
import { formatDateTime } from 'src/helpers/date';
import { ButtonLink, PageLink } from 'src/components/links';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { useForm } from 'react-hook-form';
import { updateUserUIOptions } from 'src/actions/currentUser';

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

const Actions = ({ id, handleDelete, handleEdit, reportType, report, ...rest }) => {
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
    handleEdit,
    isScheduledReportsEnabled,
    onDashboard,
    updateUserUIOptions,
  } = props;
  const handleReportChange = report => {
    props.handleReportChange(report);
    onClose();
  };

  const myReports = reports.filter(({ creator }) => creator === currentUser);

  const { register, handleSubmit } = useForm({ defaultValues: { reportId: null } });

  const myReportsRows = report => {
    const { name, modified, isLast, id } = report;
    if (onDashboard)
      return [
        <Radio value={id} ref={register({ required: true })} id={id} name="reportId" />,
        <div>{name}</div>,
        <div>{formatDateTime(modified)}</div>,
      ];

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
        handleEdit={handleEdit}
        report={report}
        isLast={isLast}
      />,
    ];
  };

  const getMyReportColumns = () => {
    if (onDashboard)
      return [
        {},
        { label: 'Name', sortKey: 'name' },
        { label: 'Last Modification', sortKey: 'modified' },
      ];

    return myReportsColumns;
  };

  const getColumnsForAllReports = () => {
    if (onDashboard)
      return [
        {},
        { label: 'Name', sortKey: 'name' },
        { label: 'Last Modification', width: '25%', sortKey: 'modified' },
        { label: 'Created By', sortKey: 'creator' },
        {},
      ];

    return allReportsColumns;
  };

  const allReportsRows = report => {
    const { name, modified, creator, subaccount_id, current_user_can_edit, isLast, id } = report;
    //conditionally render the actionlist
    const action = current_user_can_edit ? (
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-allreports-${report.id}`}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        report={report}
        isLast={isLast}
      />
    ) : (
      ''
    );
    const row = [
      <div>{formatDateTime(modified)}</div>,
      <div>{creator}</div>,
      <Tag>
        <Subaccount id={subaccount_id} master={subaccount_id === 0} shrinkLength={12} />
      </Tag>,
    ];
    if (onDashboard)
      return [
        <Radio value={id} ref={register({ required: true })} id={id} name="reportId" />,
        <div>{name}</div>,
        ...row,
      ];

    return [
      <ButtonLink
        onClick={() => {
          handleReportChange(report);
        }}
      >
        {name}
      </ButtonLink>,
      ...row,
      action,
    ];
  };

  const onSubmit = data => {
    const { reportId } = data;

    updateUserUIOptions({ pinned_report: reportId });

    onClose();
  };

  const ModalContentContainer = ({ children }) => {
    if (!onDashboard) return <>{children}</>;

    return (
      <form onSubmit={handleSubmit(onSubmit)} id="changeReportForm">
        <Radio.Group label="reportList" labelHidden>
          {children}
        </Radio.Group>
      </form>
    );
  };

  return (
    <Modal open={open} onClose={onClose} showCloseButton maxWidth="1300">
      <Modal.Header>{onDashboard ? 'Change Report' : 'Saved Reports'}</Modal.Header>
      <Modal.Content>
        {/* Use p instead of padding due to bug in matchbox 4.3.1*/}
        <Tabs tabs={[{ content: 'My Reports' }, { content: 'All Reports' }]} forceRender fitted>
          <Tabs.Item>
            <ModalContentContainer>
              <TableCollection
                rows={myReports}
                columns={getMyReportColumns()}
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
            </ModalContentContainer>
          </Tabs.Item>
          <Tabs.Item>
            <ModalContentContainer>
              <TableCollection
                rows={reports}
                columns={getColumnsForAllReports()}
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
            </ModalContentContainer>
          </Tabs.Item>
        </Tabs>
      </Modal.Content>
      {onDashboard && (
        <Modal.Footer>
          <Button variant="primary" type="submit" form="changeReportForm" loadingLabel="Loading">
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
export default connect(mapStateToProps, { updateUserUIOptions })(ReportsListModal);
