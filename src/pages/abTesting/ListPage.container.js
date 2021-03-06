import { connect } from 'react-redux';
import _ from 'lodash';
// Actions
import { listAbTests, deleteAbTest, cancelAbTest } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { ListPage } from './ListPage';
import React, { useEffect } from 'react';
import { useEmptyState } from 'src/hooks';
import AbTestEmptyState from './components/EmptyState';
import { Loading } from 'src/components';
import { useHibana } from 'src/context/HibanaContext';

function ListPageContainer(props) {
  const { abTests, listAbTests, loading } = props;
  const [{ isHibanaEnabled }] = useHibana();
  useEffect(() => {
    listAbTests();
  }, [listAbTests]);

  const component = useEmptyState({
    isEmpty: abTests.length === 0 && props.isEmptyStateEnabled && isHibanaEnabled,
    pageComponent: ListPage,
    emptyComponent: AbTestEmptyState,
  })({ ...props, isHibanaEnabled });

  if (loading) {
    return <Loading />;
  }

  return component;
}

const mapDispatchToProps = { listAbTests, deleteAbTest, cancelAbTest, showAlert };

function mapStateToProps(state) {
  const { abTesting } = state;
  return {
    abTests: abTesting.list,
    loading: abTesting.listLoading,
    deletePending: abTesting.deletePending,
    cancelPending: abTesting.cancelPending,
    error: abTesting.listError,
    isEmptyStateEnabled: isAccountUiOptionSet('allow_empty_states')(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPageContainer);
