import React from 'react';
import PageLink from 'src/components/pageLink';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import styles from './DataCell.module.scss';

const FacetDataCell = ({ dimension, facet, id, name, signalOptions }) => {
  let label = id;
  let search;

  if (facet === 'sid' && id === 0) {
    label = 'Master Account';
  }

  if (facet === 'sid' && id === -1) {
    label = 'Master & All Subaccounts';
  }

  if (name) {
    label = `${name} (${id})`;
  }

  if (signalOptions.subaccount) {
    search = setSubaccountQuery(signalOptions.subaccount.id);
  }

  return (
    <div className={styles.PaddedCell}>
      <PageLink
        children={label}
        to={{
          pathname: `/signals/${dimension}/${facet}/${id}`,
          search
        }}
      />
    </div>
  );
};

export default FacetDataCell;
