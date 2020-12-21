import React from 'react';
import { useLocation } from 'react-router-dom';
import { segmentTrack, SEGMENT_EVENTS } from 'src/helpers/segment';

export default function useEmptyState({
  isEmpty,
  pageComponent: Page,
  emptyComponent: EmptyState,
  segmentMetaData,
}) {
  const location = useLocation();
  if (isEmpty) {
    segmentTrack(SEGMENT_EVENTS.EMPTY_STATE_LOADED, {
      location: location,
      ...segmentMetaData,
    });
  }
  return props => (isEmpty ? <EmptyState /> : <Page {...props} />);
}
