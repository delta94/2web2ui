import React from 'react';
import { TableCollection, Subaccount } from 'src/components';
import { Box, Radio, Table, Tag } from 'src/components/matchbox';
import { formatDateTime } from 'src/helpers/date';

const FilterBoxWrapper = props => (
  <Box borderBottom="400" padding="400">
    {props}
  </Box>
);

export const MyReportsTabWithSelectableRows = ({
  reports,
  currentUser,
  handleRadioChange,
  selectedReportId,
  searchedText,
  setSearchedText,
}) => {
  const myReports = reports.filter(({ creator }) => creator === currentUser);
  const getMyReportColumns = () => {
    return [
      {},
      { label: 'Name', sortKey: 'name' },
      { label: 'Last Modification', sortKey: 'modified' },
    ];
  };
  const myReportsRows = report => {
    const { name, modified, id } = report;
    return [
      <Radio
        value={id}
        id={id}
        key={id}
        name="reportId"
        label={`Report ${id}`}
        labelHidden
        onChange={() => handleRadioChange(id)}
        checked={selectedReportId === id}
      />,
      <div>{name}</div>,
      <div>{formatDateTime(modified)}</div>,
    ];
  };
  return (
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
        initialValue: searchedText,
        onChange: value => setSearchedText(value),
      }}
    />
  );
};

export const AllReportsTabWithSelectableRows = ({
  reports,
  handleRadioChange,
  selectedReportId,
  searchedText,
  setSearchedText,
}) => {
  const getColumnsForAllReports = () => {
    return [
      {},
      { label: 'Name', sortKey: 'name' },
      { label: 'Last Modification', width: '25%', sortKey: 'modified' },
      { label: 'Created By', sortKey: 'creator' },
      {},
    ];
  };

  const allReportsRows = report => {
    const { name, modified, creator, subaccount_id, id } = report;
    return [
      <Radio
        value={id}
        id={id}
        key={id}
        label={`Report ${id}`}
        labelHidden
        name="reportId"
        onChange={() => handleRadioChange(id)}
        checked={selectedReportId === id}
      />,
      <div>{name}</div>,
      <div>{formatDateTime(modified)}</div>,
      <div>{creator}</div>,
      <Tag>
        <Subaccount id={subaccount_id} master={subaccount_id === 0} shrinkLength={12} />
      </Tag>,
    ];
  };
  return (
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
        initialValue: searchedText,
        onChange: value => setSearchedText(value),
      }}
    />
  );
};
