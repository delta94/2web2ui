import React, { useState } from 'react';
import { Grid, Panel, ScreenReaderOnly, Select, Table } from 'src/components/matchbox';
import { Collection } from 'src/components/index';
import _ from 'lodash';
import styles from './FilterSortCollection.module.scss';
import TableHeader from 'src/components/collection/TableHeader';
import useHibanaToggle from 'src/hooks/useHibanaToggle';

const OGFilterSortCollection = ({
  wrapperComponent,
  title,
  selectOptions,
  filterBoxConfig,
  defaultSortColumn,
  defaultSortDirection = 'desc',
  rows = [],
  columns,
  headerComponent,
  rowComponent,
  getRowData,
  saveCsv = true,
  sortLabel = 'Sort Select',
}) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const setSort = ({ sortColumn, sortDirection }) => {
    setSortColumn(sortColumn);
    setSortDirection(sortDirection);
  };

  const sortOnChange = ({ target: { value } }) =>
    setSort({ sortColumn: value, sortDirection: defaultSortDirection });

  const TableBody = props => <tbody>{props.children}</tbody>;

  const CollectionWrapperComponent = props => (
    <div className={styles.TableWrapper}>
      <Table>{props.children}</Table>
    </div>
  );

  const WrapperComponent = wrapperComponent ? wrapperComponent : CollectionWrapperComponent;
  const RowComponent = rowComponent
    ? rowComponent
    : props => <Table.Row rowData={getRowData(props)} />;
  const HeaderComponent = headerComponent
    ? headerComponent
    : columns
    ? () => <TableHeader columns={columns} />
    : () => null;
  const sortedRows = sortColumn ? _.orderBy(rows, sortColumn, sortDirection) : rows;

  return (
    <Collection
      outerWrapper={WrapperComponent}
      bodyWrapper={TableBody}
      headerComponent={HeaderComponent}
      rowComponent={RowComponent}
      getRowData={getRowData}
      rows={sortedRows}
      sortColumn={sortColumn}
      filterBox={filterBoxConfig}
      pagination={true}
      defaultPerPage={10}
      saveCsv={saveCsv}
    >
      {({ collection, filterBox, pagination }) => (
        <>
          <Panel.LEGACY>
            {title && (
              <Panel.LEGACY.Section className={styles.Title}>
                <h3>{title}</h3>
              </Panel.LEGACY.Section>
            )}
            <div className={styles.FilterPanel}>
              <Grid>
                <Grid.Column xs={12} md={9}>
                  {filterBox}
                </Grid.Column>
                <Grid.Column xs={12} md={3}>
                  <label htmlFor="sortSelect">
                    <ScreenReaderOnly>{sortLabel}</ScreenReaderOnly>
                  </label>
                  <Select
                    id="sortSelect"
                    defaultValue={defaultSortColumn}
                    options={selectOptions}
                    onChange={sortOnChange}
                  />
                </Grid.Column>
              </Grid>
            </div>
            {collection}
          </Panel.LEGACY>
          {pagination}
        </>
      )}
    </Collection>
  );
};

const HibanaFilterSortCollection = ({
  wrapperComponent,
  title,
  selectOptions,
  filterBoxConfig,
  defaultSortColumn,
  defaultSortDirection = 'desc',
  rows = [],
  columns,
  headerComponent,
  rowComponent,
  getRowData,
  saveCsv = true,
  sortLabel,
}) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const setSort = ({ sortColumn, sortDirection }) => {
    setSortColumn(sortColumn);
    setSortDirection(sortDirection);
  };

  const sortOnChange = ({ target: { value } }) =>
    setSort({ sortColumn: value, sortDirection: defaultSortDirection });

  const TableBody = props => <tbody>{props.children}</tbody>;

  const CollectionWrapperComponent = props => (
    <div>
      <Table>{props.children}</Table>
    </div>
  );

  const WrapperComponent = wrapperComponent ? wrapperComponent : CollectionWrapperComponent;
  const RowComponent = rowComponent
    ? rowComponent
    : props => <Table.Row rowData={getRowData(props)} />;

  const HeaderComponent = headerComponent
    ? headerComponent
    : columns
    ? () => <TableHeader columns={columns} />
    : () => null;

  const sortedRows = sortColumn ? _.orderBy(rows, sortColumn, sortDirection) : rows;

  return (
    <Collection
      outerWrapper={WrapperComponent}
      bodyWrapper={TableBody}
      headerComponent={HeaderComponent}
      getRowData={getRowData}
      rowComponent={RowComponent}
      rows={sortedRows}
      sortColumn={sortColumn}
      filterBox={{ maxWidth: '100%', ...filterBoxConfig }}
      pagination={true}
      defaultPerPage={10}
      saveCsv={saveCsv}
    >
      {({ collection, filterBox, pagination }) => (
        <>
          <Panel.LEGACY title={title}>
            <Panel.LEGACY.Section>
              <Grid>
                <Grid.Column xs={12} md={9}>
                  {filterBox}
                </Grid.Column>
                <Grid.Column xs={12} md={3}>
                  {!sortLabel && (
                    <label htmlFor="sortSelect">
                      <ScreenReaderOnly>Sort Select</ScreenReaderOnly>
                    </label>
                  )}
                  <Select
                    id="sortSelect"
                    label={sortLabel}
                    defaultValue={defaultSortColumn}
                    options={selectOptions}
                    onChange={sortOnChange}
                  />
                </Grid.Column>
              </Grid>
            </Panel.LEGACY.Section>

            {collection}
          </Panel.LEGACY>
          {pagination}
        </>
      )}
    </Collection>
  );
};

const FilterSortCollection = props => {
  return useHibanaToggle(OGFilterSortCollection, HibanaFilterSortCollection)(props);
};

export default FilterSortCollection;
