import React from 'react';

export default function useEmptyState(isEmpty, Page, EmptyState) {
  return props => (isEmpty ? <EmptyState /> : <Page {...props} />);
}
