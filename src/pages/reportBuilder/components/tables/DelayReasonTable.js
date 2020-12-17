import React from 'react';
import { LongTextContainer, Percent, TableCollection } from 'src/components';
import { safeRate } from 'src/helpers/math';
import {
  EmptyWrapper,
  FilterBoxWrapper,
  LoadingWrapper,
  TableCollectionBody,
  TableWrapper,
} from '../Wrappers';

const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['domain', 'reason'],
  exampleModifiers: ['domain', 'reason'],
  matchThreshold: 5,
  label: 'Filter',
  wrapper: FilterBoxWrapper,
};

const columns = [
  { label: 'Total Delays', sortKey: 'count_delayed' },
  { label: 'Delayed First Attempt (%)', sortKey: 'count_delayed_first' },
  { label: 'Reason', sortKey: 'reason', width: '45%' },
  { label: 'Domain', sortKey: 'domain' },
];

export default function DelayReasonTable({ reasons, totalAccepted, loading }) {
  const getRowData = rowData => {
    const { reason, domain, count_delayed, count_delayed_first } = rowData;

    return [
      count_delayed,
      <span>
        {count_delayed_first} (<Percent value={safeRate(count_delayed_first, totalAccepted)} />)
      </span>,
      <LongTextContainer text={reason} />,
      domain,
    ];
  };

  if (loading) {
    return <LoadingWrapper />;
  }

  if (!reasons.length) {
    return <EmptyWrapper message="No delay reasons to report" />;
  }
  return (
    <TableCollection
      columns={columns}
      rows={reasons}
      getRowData={getRowData}
      pagination
      defaultSortColumn="count_delayed"
      defaultSortDirection="desc"
      wrapperComponent={TableWrapper}
      filterBox={filterBoxConfig}
    >
      {props => <TableCollectionBody {...props} />}
    </TableCollection>
  );
}
