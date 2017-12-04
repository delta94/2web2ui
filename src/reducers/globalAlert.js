import _ from 'lodash';

const initialState = {
  alerts: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SHOW_GLOBAL_ALERT':
      return { ...state, alerts: [ ...state.alerts,
        {
          id: _.uniqueId('alert_'),
          ...payload
        }
      ]};

    case 'CLEAR_GLOBAL_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(({ id }) => id !== payload.id)
      };

    default:
      return state;
  }
};
