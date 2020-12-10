import { connect } from 'react-redux';
import _ from 'lodash';
// Actions
import { listAbTests, deleteAbTest, cancelAbTest } from 'src/actions/abTesting';
import { showAlert } from 'src/actions/globalAlert';
import { ListPage } from './ListPage';
import { useEffect } from 'react';
import { useEmptyState } from 'src/hooks';
import AbTestEmptyState from './components/EmptyState';

function ListPageContainer(props) {
  const { abTests, listAbTests } = props;
  useEffect(() => {
    listAbTests();
  }, [listAbTests]);

  const component = useEmptyState(abTests.length === 0, ListPage, AbTestEmptyState)(props);

  return component;
}

const mapDispatchToProps = { listAbTests, deleteAbTest, cancelAbTest, showAlert };

function mapStateToProps({ abTesting }) {
  return {
    abTests: abTesting.list,
    loading: abTesting.listLoading,
    deletePending: abTesting.deletePending,
    cancelPending: abTesting.cancelPending,
    error: abTesting.listError,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPageContainer);
