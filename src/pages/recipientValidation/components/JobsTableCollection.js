import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import TableCollection from 'src/components/collection/TableCollection';
import { formatDateTime } from 'src/helpers/date';
import withJobs from '../containers/withJobs';
import JobFileName from './JobFileName';
import JobAddressCount from './JobAddressCount';
import JobReportDownloadLink from './JobReportDownloadLink';
import JobStatusTag from './JobStatusTag';

export const JobsTableCollection = ({ jobs }) => {
  const columns = [
    {
      dataCellComponent: ({ status, filename, jobId }) => (
        <JobFileName
          status={status}
          filename={filename}
          jobId={jobId}
        />
      ),
      header: {
        label: 'File Name',
        sortKey: 'filename'
      }
    },
    {
      dataCellComponent: ({ uploadedAt }) => formatDateTime(uploadedAt),
      header: {
        label: 'Date Uploaded',
        sortKey: 'uploadedAt'
      }
    },
    {
      dataCellComponent: ({ status }) => <JobStatusTag status={status} />,
      header: {
        label: 'Status',
        sortKey: 'status'
      }
    },
    {
      dataCellComponent: ({ addressCount, status }) => (
        <JobAddressCount count={addressCount} status={status} />
      ),
      header: {
        label: 'Total',
        sortKey: 'addressCount'
      }
    },
    {
      dataCellComponent: ({ rejectedUrl, status }) => (
        <JobReportDownloadLink href={rejectedUrl} status={status} />
      ),
      header: {
        label: 'Download'
      }
    }
  ];

  const renderRow = (columns) => (props) => (
    columns.map(({ dataCellComponent: DataCellComponent }) => <DataCellComponent {...props} />)
  );

  return (
    <TableCollection
      columns={columns.map(({ header }) => header)}
      defaultSortColumn="uploadedAt"
      defaultSortDirection="desc"
      getRowData={renderRow(columns)}
      rows={jobs}
      pagination
      title="Recent Validations"
    >
      {({ collection, filterBox, heading, pagination }) => (
        <>
          <Panel>
            <Panel.Section>
              {heading}
            </Panel.Section>
            {filterBox}
            {collection}
          </Panel>
          {pagination}
        </>
      )}
    </TableCollection>
  );
};

export default withJobs(JobsTableCollection);
