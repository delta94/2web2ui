/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import CollectionPropTypes from './Collection.propTypes';
import qs from 'query-string';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Pagination from './Pagination';
import FilterBox from './FilterBox';
import { Empty } from 'src/components';
import { objectSortMatch } from 'src/helpers/sortMatch';
import styled from 'styled-components';
import { Table } from 'src/components/matchbox';

const StyledTd = styled.td`
  padding: 0;
`;

const PassThroughWrapper = props => props.children;
const NullComponent = () => null;
const objectValuesToString = keys => item =>
  (keys || Object.keys(item)).map(key => item[key]).join(' ');

export class Collection extends Component {
  state = {};

  static defaultProps = {
    defaultPerPage: 25,
    filterBox: {
      show: false,
    },
  };

  componentDidMount() {
    const { defaultPerPage, filterBox, location } = this.props;

    this.setState({
      perPage: defaultPerPage,
      currentPage: Number(qs.parse(location.search).page) || 1,
      filteredRows: null,
      pattern: undefined,
    });

    if (filterBox.show && filterBox.initialValue) {
      this.handleFilterChange(filterBox.initialValue);
    }
  }

  componentDidUpdate(prevProps) {
    // re-calculate filtered results if the incoming
    // row data has changed
    if (this.props.rows !== prevProps.rows) {
      this.handleFilterChange(this.state.pattern);
    }
  }

  handlePageChange = index => {
    const currentPage = index + 1;
    this.setState({ currentPage }, this.maybeUpdateQueryString);
  };

  handlePerPageChange = perPage => {
    this.setState({ perPage, currentPage: 1 }, this.maybeUpdateQueryString);
  };

  handleFilterChange = pattern => {
    const { rows, filterBox, sortColumn, sortDirection } = this.props;
    const { keyMap, itemToStringKeys, matchThreshold, onChange } = filterBox;
    const update = {
      currentPage: 1,
      filteredRows: null,
      pattern,
    };

    if (pattern) {
      const filteredRows = objectSortMatch({
        items: rows,
        pattern,
        getter: objectValuesToString(itemToStringKeys),
        keyMap,
        matchThreshold,
      });

      // Ultimately respect the sort column, if present
      if (sortColumn) {
        update.filteredRows = _.orderBy(filteredRows, sortColumn, sortDirection || 'asc');
      } else {
        update.filteredRows = filteredRows;
      }
    }

    this.setState(update);
    if (onChange) onChange(pattern);
  };

  debouncedHandleFilterChange = _.debounce(this.handleFilterChange, 300);

  maybeUpdateQueryString() {
    const { location, pagination, updateQueryString } = this.props;
    if (!pagination || updateQueryString === false) {
      return;
    }
    const { currentPage, perPage } = this.state;
    const { search, pathname } = location;
    const parsed = qs.parse(search);
    if (parsed.page || updateQueryString) {
      const updated = Object.assign(parsed, { page: currentPage, perPage });
      this.props.history.push(`${pathname}?${qs.stringify(updated)}`);
    }
  }

  getVisibleRows() {
    const { perPage, currentPage, filteredRows } = this.state;
    const { rows = [], pagination } = this.props;

    if (!pagination) {
      return filteredRows || rows;
    }

    const currentIndex = (currentPage - 1) * perPage;
    return (filteredRows || rows).slice(currentIndex, currentIndex + perPage);
  }

  renderFilterBox() {
    const { filterBox, rows } = this.props;

    if (filterBox.show) {
      return <FilterBox {...filterBox} rows={rows} onChange={this.debouncedHandleFilterChange} />;
    }

    return null;
  }

  renderPagination() {
    const { rows, perPageButtons, pagination, saveCsv = true } = this.props;
    const { currentPage, perPage, filteredRows } = this.state;

    if (!pagination || !currentPage) {
      return null;
    }

    return (
      <Pagination
        data={filteredRows || rows}
        perPage={perPage}
        currentPage={currentPage}
        perPageButtons={perPageButtons}
        onPageChange={this.handlePageChange}
        onPerPageChange={this.handlePerPageChange}
        saveCsv={saveCsv}
      />
    );
  }

  render() {
    // const { perPage, currentPage, filteredRows } = this.state;
    const {
      rows,
      getRowData,
      rowComponent: RowComponent,
      rowKeyName = 'id',
      headerComponent: HeaderComponent = NullComponent,
      outerWrapper: OuterWrapper = PassThroughWrapper,
      bodyWrapper: BodyWrapper = PassThroughWrapper,
      children,
      title,
    } = this.props;
    const filterBox = this.renderFilterBox();
    const visibleRows = this.getVisibleRows();

    // if (!perPage || !currentPage) {
    //   return <></>;
    // }

    // let areEqual = function() {
    //   console.log('areEqual: ', arguments);
    // };
    // let MemoRowComponent = React.memo(RowComponent, areEqual);

    // Why is this render method being called ~5 times when the modal opens?
    // eslint-disable-next-line no-console
    console.log('visibleRows: ', visibleRows);
    // console.log('state: ', this.state);

    const collection = (
      <OuterWrapper>
        <HeaderComponent />
        <BodyWrapper>
          {visibleRows.length === 0 ? (
            <tr>
              <StyledTd colSpan="100%">
                <Empty message="No results found." />
              </StyledTd>
            </tr>
          ) : (
            visibleRows.map((row, i) => {
              return <RowComponent key={row[rowKeyName]} {...row} index={i} />;
            })
          )}
        </BodyWrapper>
      </OuterWrapper>
    );
    const pagination = this.renderPagination();
    const heading = title ? <h3>{title}</h3> : null;

    return typeof children === 'function' ? (
      children({ filterBox, collection, heading, pagination })
    ) : (
      <div>
        {heading}
        {filterBox}
        {collection}
        {pagination}
      </div>
    );
  }
}

Collection.propTypes = CollectionPropTypes;

export default withRouter(Collection);

// BREAKS!
// visibleRows.map((row, i) => {
//   console.log('collection row: ', row);
//   return <RowComponent key={row[rowKeyName]} {...row} index={i} />;
// })

// BREAKS!
// visibleRows.map((row, i) => {
//   console.log('collection row: ', row);
//   return <RowComponent key={`${row[rowKeyName] || 'row'}-${i}`} {...row} index={i} />;
// })

// BREAKS!
// visibleRows.map((row, i) => (
//   <RowComponent
//     key={`${row[rowKeyName] || 'row'}-${i}`}
//     {...row}
//     index={i}
//     isLast={visibleRows.length === i + 1} // Temporary. Would like to update the hook to include pagination
//   />
// ))

// WORKS!
// visibleRows.map(row => (
//   <Table.Row key={row[rowKeyName]}>
//     {getRowData(row).map(i => (
//       <td>{i}</td>
//     ))}
//   </Table.Row>
// ))

// WORKS!
// visibleRows.map((row, i) => (
//   <Table.Row key={`${i}`} >
//     {getRowData(row).map(i => (
//       <td>{i}</td>
//     ))}
//   </Table.Row>
// ))

// WORKS!
// visibleRows.map((row, i) => (
//   <Table.Row key={`${i}`} rowData={getRowData(row)}></Table.Row>
// ))

// visibleRows.map((row, i) => {
//   return <Table.Row key={`${i}`} rowData={getRowData(row)}></Table.Row>;
// })
