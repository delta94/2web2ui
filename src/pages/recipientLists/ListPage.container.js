import React from 'react';
import { connect } from 'react-redux';

// Actions
import { listRecipientLists } from 'src/actions/recipientLists';

// Components and Helpers
import { ListPage } from './ListPage';
import { useEmptyState } from 'src/hooks';
import RecipientListEmptyState from './components/RecipientListEmptyState';
import { Loading } from 'src/components';
import { useHibana } from 'src/context/HibanaContext';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';

function ListPageContainer(props) {
  const { listRecipientLists, recipientLists, loading, isEmptyStateEnabled } = props;
  const [{ isHibanaEnabled }] = useHibana();

  React.useEffect(() => {
    listRecipientLists();
  }, [listRecipientLists]);

  const component = useEmptyState({
    isEmpty: recipientLists.length === 0 && isEmptyStateEnabled && isHibanaEnabled,
    pageComponent: ListPage,
    emptyComponent: RecipientListEmptyState,
  })({ ...props, isHibanaEnabled });

  if (loading) {
    return <Loading />;
  }

  return component;
}

const mapStateToProps = state => ({
  error: state.recipientLists.error,
  loading: state.recipientLists.listLoading,
  recipientLists: state.recipientLists.list,
  isEmptyStateEnabled: isAccountUiOptionSet('allow_empty_states')(state),
});

export default connect(mapStateToProps, { listRecipientLists })(ListPageContainer);
