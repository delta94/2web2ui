import React, { Component } from 'react';
import _ from 'lodash';
import { Panel, Table } from 'src/components/matchbox';
import Collection from './Collection';
import TableHeader from './TableHeader';
import styles from './TableCollection.module.scss';

import useHibanaToggle from 'src/hooks/useHibanaToggle';

const OGTableWrapper = props => (
  <Panel.LEGACY>
    <div className={styles.TableWrapper}>
      <Table>{props.children}</Table>
    </div>
  </Panel.LEGACY>
);

const HibanaTableWrapper = props => (
  <Panel.LEGACY>
    <div>
      <Table>{props.children}</Table>
    </div>
  </Panel.LEGACY>
);

const TableWrapper = props => {
  return useHibanaToggle(OGTableWrapper, HibanaTableWrapper)(props);
};

const TableBody = props => <tbody>{props.children}</tbody>;

class TableCollection extends Component {
  state = {
    sortColumn: null,
    sortDirection: null,
  };

  static defaultProps = {
    defaultSortColumn: null,
    defaultSortDirection: 'asc',
  };

  componentDidMount() {
    const { defaultSortColumn, defaultSortDirection } = this.props;
    this.setState({ sortColumn: defaultSortColumn, sortDirection: defaultSortDirection });
  }

  handleSortChange = (column, direction) => {
    this.setState({ sortColumn: column, sortDirection: direction });
  };

  render() {
    const {
      rowComponent,
      wrapperComponent,
      headerComponent,
      columns,
      getRowData,
      rows,
      title,
    } = this.props;
    const { sortColumn, sortDirection } = this.state;

    const WrapperComponent = wrapperComponent ? wrapperComponent : TableWrapper;
    const HeaderComponent = headerComponent
      ? headerComponent
      : () => (
          <TableHeader
            columns={columns}
            onSort={this.handleSortChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        );

    // original
    const TableRow = rowComponent
      ? rowComponent
      : props => <Table.Row rowData={getRowData(props)} />;

    // without Table.Row (that doesnt seem to matter though)
    // const TableRow = rowComponent
    //   ? rowComponent
    //   : props => (
    //       <tr>
    //         {getRowData(props).map(i => (
    //           <td>{i}</td>
    //         ))}
    //       </tr>
    //     );

    const sortedRows = sortColumn ? _.orderBy(rows, sortColumn, sortDirection) : rows;

    return (
      <Collection
        outerWrapper={WrapperComponent}
        headerComponent={HeaderComponent}
        bodyWrapper={TableBody}
        rowComponent={TableRow}
        getRowData={getRowData}
        {...this.props}
        rows={sortedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        title={title}
      />
    );
  }
}

export default TableCollection;
