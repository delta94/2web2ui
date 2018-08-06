import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { setSubaccountQuery } from 'src/helpers/subaccounts';

// Components
import { UnstyledLink, Button, Popover, ActionList } from '@sparkpost/matchbox';
import { TableCollection } from 'src/components';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import StatusTag from './StatusTag';
import { formatDateTime } from 'src/helpers/date';

import styles from '../ListPage.module.scss';

const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['name', 'id', 'status', 'test_mode'],
  exampleModifiers: ['id', 'status', 'test_mode']
};

export class TestCollection extends Component {

  componentDidMount() {}

  getDetailsLink = ({ id, version, subaccount_id }) => `/ab-testing/${id}/${version}${setSubaccountQuery(subaccount_id)}`

  getColumns() {
    const columns = [
      { label: 'Name', sortKey: 'name' },
      { label: 'Status', sortKey: 'status' },
      { label: 'Template', sortKey: (i) => i.winning_template_id || i.default_template.template_id },
      { label: 'Last Modified', sortKey: 'updated_at' },
      null
    ];

    return columns;
  }

  getRowData = ({ id, version, subaccount_id, name, status, updated_at, default_template, winning_template_id }) => {
    const actions = [
      {
        content: 'Edit Test',
        to: this.getDetailsLink({ id, version, subaccount_id }),
        component: Link,
        visible: status === 'scheduled' || status === 'draft',
        section: 1
      },
      {
        content: 'View Test',
        to: this.getDetailsLink({ id, version, subaccount_id }),
        component: Link,
        visible: status === 'running' || status === 'cancelled' || status === 'completed',
        section: 1
      },
      {
        content: 'Edit and Rerun Test',
        visible: status === 'completed' || status === 'cancelled',
        section: 1
      },
      {
        content: 'Cancel Test',
        visible: status === 'scheduled' || status === 'running',
        section: 2,
        onClick: () => this.props.toggleCancel(id, subaccount_id)
      },
      {
        content: 'Delete Test',
        visible: status === 'completed' || status === 'cancelled',
        section: 2,
        onClick: () => this.props.toggleDelete(id, subaccount_id)
      }
    ];

    const template = winning_template_id
      ? <Fragment><span className={styles.Winner}>Winner:</span> {winning_template_id}</Fragment>
      : default_template.template_id;

    return [
      <Fragment>
        <p className={styles.Name}>
          <strong><UnstyledLink to={this.getDetailsLink({ id, version, subaccount_id })} component={Link}>{name}</UnstyledLink></strong>
        </p>
        <p className={styles.Id}>ID: {id}</p>
      </Fragment>,
      <StatusTag status={status}/>,
      <p className={styles.Template}>{template}</p>,
      <p className={styles.LastUpdated}>{formatDateTime(updated_at)}</p>,
      <div style={{ textAlign: 'right' }}>
        <Popover left trigger={<Button flat size='large'><MoreHoriz size={21}/></Button>}>
          <ActionList actions={actions}/>
        </Popover>
      </div>
    ];
  }

  render() {
    const { abTests } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={abTests}
        getRowData={this.getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
        defaultSortColumn='updated_at'
        defaultSortDirection='desc'
      />
    );
  }
}

export default TestCollection;
