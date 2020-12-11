import React from 'react';
import { useLocation } from 'react-redux';
import { segmentTrack, SEGMENT_EVENTS } from 'src/helpers/segment';

export default function useEmptyState(isEmpty, Page, EmptyState) {
  const location = useLocation();
  if (isEmpty) {
    segmentTrack(SEGMENT_EVENTS.EMPTY_STATE_LOADED, {
      location: location,
    });
  }
  return props => (isEmpty ? <EmptyState /> : <Page {...props} />);
}
