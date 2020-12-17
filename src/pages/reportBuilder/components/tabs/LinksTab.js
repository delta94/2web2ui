import React, { useEffect } from 'react';
import { Percent, TableCollection } from 'src/components';
import { refreshEngagementReportV2 as refreshEngagementReport } from 'src/actions/engagementReport';
import { connect } from 'react-redux';
import { safeRate } from 'src/helpers/math';
import {
  EmptyWrapper,
  FilterBoxWrapper,
  LoadingWrapper,
  TableCollectionBody,
  TableWrapper,
} from '../Wrappers';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';

const filterBoxConfig = {
  show: true,
  keyMap: { link: 'link_name' },
  itemToStringKeys: ['link_name'],
  exampleModifiers: ['link_name'],
  matchThreshold: 5,
  label: 'Filter',
  wrapper: FilterBoxWrapper,
};

const columns = [
  { label: 'Link', sortKey: 'link_name' },
  { label: 'Unique Clicks', sortKey: 'count_raw_clicked_approx' },
  { label: 'Clicks', sortKey: 'count_clicked' },
  { label: 'Percent of Total', sortKey: 'percentage_clicked' },
];

export function LinksTab(props) {
  const { state: reportOptions } = useReportBuilderContext();
  const { loading, links, refreshEngagementReport, totalClicks } = props;

  useEffect(() => {
    if (reportOptions.to && reportOptions.from) {
      refreshEngagementReport(reportOptions);
    }
  }, [refreshEngagementReport, reportOptions]);

  const getRowData = rowData => {
    const { count_clicked, count_raw_clicked_approx, link_name } = rowData;
    return [
      link_name,
      count_raw_clicked_approx,
      count_clicked,
      <Percent value={safeRate(count_clicked, totalClicks)} />,
    ];
  };

  if (loading) {
    return <LoadingWrapper />;
  }

  if (!links.length) {
    return <EmptyWrapper message="No links to report" />;
  }

  return (
    <TableCollection
      columns={columns}
      rows={links}
      getRowData={getRowData}
      pagination
      defaultSortColumn="link_name"
      defaultSortDirection="asc"
      wrapperComponent={TableWrapper}
      filterBox={filterBoxConfig}
    >
      {props => <TableCollectionBody {...props} />}
    </TableCollection>
  );
}

const mapStateToProps = state => {
  const { aggregateMetrics = {}, linkMetrics = {} } = state.engagementReport;
  const { data: aggregateData = {} } = aggregateMetrics;
  return {
    loading: linkMetrics.loading || aggregateMetrics.loading,
    totalClicks: aggregateData.count_clicked,
    links: linkMetrics.data,
  };
};

const mapDispatchToProps = {
  refreshEngagementReport,
};
export default connect(mapStateToProps, mapDispatchToProps)(LinksTab);
