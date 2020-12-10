/* eslint-disable no-unused-vars */
import React from 'react';
import { MoreHoriz, PushPin } from '@sparkpost/matchbox-icons';
import styled from 'styled-components';
import { TableCollection, Collection, TmpCollection, Subaccount } from 'src/components';
import {
  ActionList,
  Box,
  Button,
  Popover,
  ScreenReaderOnly,
  Table,
  Tag,
  Tooltip,
} from 'src/components/matchbox';
import { formatDateTime } from 'src/helpers/date';
import { ButtonLink, PageLink } from 'src/components/links';

const PinToDashboardAction = styled(ActionList.Action)`
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

const Icons = ({ report, pinnedReport }) => {
  let icons = [];
  if (pinnedReport && pinnedReport.id === report.id) {
    icons.push(
      <Tooltip content="Pinned to Dashboard">
        <PushPin label="pinned-to-dashboard" />
      </Tooltip>,
    );
  }
  return icons;
};

const Actions = ({ id, handleDelete, handleEdit, handlePin, reportType, report, ...rest }) => {
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
        {rest.allowDashboardV2 && (
          <PinToDashboardAction
            content="Pin to Dashboard"
            is="button"
            onClick={() => (reportIsPinned ? '' : handlePin(report, rest.pinnedReport))}
            disabled={reportIsPinned}
            tabIndex={reportIsPinned ? '-1' : false}
          />
        )}
        <ActionList.Action content="Edit" onClick={() => handleEdit(report)} />
      </ActionList>
    </Popover>
  );
};

export const MyReportsTab = ({
  reports,
  currentUser,
  handleReportChangeAndClose,
  isScheduledReportsEnabled,
  handlePin,
  handleDelete,
  handleEdit,
  pinnedReport,
  allowDashboardV2,
}) => {
  const myReports = reports.filter(({ creator }) => creator === currentUser);

  const myReportColumnHeaders = [
    { label: 'Name', sortKey: 'name' },
    { label: 'Last Modification', sortKey: 'modified' },
    {},
  ];
  if (allowDashboardV2) {
    myReportColumnHeaders.push({});
  }

  const myReportsColumns = report => {
    const { name, modified, isLast } = report;

    const myColumns = [
      <ButtonLink
        onClick={() => {
          handleReportChangeAndClose(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      allowDashboardV2 ? <Icons report={report} pinnedReport={pinnedReport}></Icons> : undefined,
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-myreports-${report.id}`}
        handlePin={handlePin}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        report={report}
        pinnedReport={pinnedReport}
        allowDashboardV2={allowDashboardV2}
        isLast={isLast}
      />,
    ];

    return myColumns.filter(Boolean);
  };

  return (
    <TableCollection
      rows={myReports}
      columns={myReportColumnHeaders}
      rowComponenet={props => <Table.Row rowData={myReportsColumns(props)} />}
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
  );
};

/**
 * PASSES:
 <table>
  <thead></thead>
  <tbody>
    {reports.map(report => {
      return (
        <tr id={`report-${report.id}`}>
          {myReportsColumns(report).map(i => (
            <td>{i}</td>
          ))}
        </tr>
      );
    })}
  </tbody>
</table>
*/

/**
 * Detached from the Dom error:
 <TmpCollection rowComponent={TableRow} rows={myReports} />

 */

/**
 * Detached from the DOM error:
<Collection
      outerWrapper={Table}
      bodyWrapper={TableBody}
      rowComponent={TableRow}
      rows={myReports}
    />
 */

/**
 * Detached from the DOM error:
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
*/

export const AllReportsTab = ({
  reports,
  handleReportChangeAndClose,
  isScheduledReportsEnabled,
  handlePin,
  handleDelete,
  handleEdit,
  pinnedReport,
  allowDashboardV2,
}) => {
  const allReportColumnHeaders = [
    { label: 'Name', sortKey: 'name' },
    { label: 'Last Modification', width: '25%', sortKey: 'modified' },
    { label: 'Created By', sortKey: 'creator' },
    {},
    {},
  ];
  if (allowDashboardV2) {
    allReportColumnHeaders.push({});
  }

  const getColumnsForAllReports = () => {
    return allReportColumnHeaders;
  };

  const allReportsColumns = report => {
    const { name, modified, creator, subaccount_id, current_user_can_edit, isLast } = report;

    const action = current_user_can_edit ? (
      <Actions
        isScheduledReportsEnabled={isScheduledReportsEnabled}
        id={`popover-allreports-${report.id}`}
        handlePin={handlePin}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        report={report}
        pinnedReport={pinnedReport}
        allowDashboardV2={allowDashboardV2}
        isLast={isLast}
      />
    ) : (
      ''
    );

    const allColumns = [
      <ButtonLink
        onClick={() => {
          handleReportChangeAndClose(report);
        }}
      >
        {name}
      </ButtonLink>,
      <div>{formatDateTime(modified)}</div>,
      <div>{creator}</div>,
      <Tag>
        <Subaccount id={subaccount_id} master={subaccount_id === 0} shrinkLength={12} />
      </Tag>,
      allowDashboardV2 ? <Icons report={report} pinnedReport={pinnedReport}></Icons> : undefined,
      action,
    ];

    return allColumns.filter(Boolean);
  };
  return (
    <TableCollection
      rows={reports}
      columns={getColumnsForAllReports()}
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
  );
};
