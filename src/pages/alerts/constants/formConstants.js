import React from 'react';
import { EmailIcon, SlackIcon, WebhookIcon } from 'src/components/icons';
import { emails, ifStringPresent } from 'src/helpers/validation';
export const FORM_NAME = 'alertForm';

export const METRICS = {
  monthly_sending_limit: 'Monthly Sending Limit',
  health_score: 'Health Score',
  block_bounce_rate: 'Block Bounce Rate',
  hard_bounce_rate: 'Hard Bounce Rate',
  soft_bounce_rate: 'Soft Bounce Rate'
};

export const FILTERS_FRIENDLY_NAMES = {
  none: 'None',
  ip_pool: 'IP Pool',
  mailbox_provider: 'Mailbox Provider',
  sending_domain: 'Sending Domain',
  sending_ip: 'Sending IP'
};

export const RECOMMENDED_METRIC_VALUE = {
  monthly_sending_limit: {
    raw: {
      gt: 80
    }},
  health_score: {
    raw: {
      lt: 80,
      gt: 70
    },
    week_over_week: {
      gt: 10
    },
    day_over_day: {
      gt: 10
    }
  },
  block_bounce_rate: {
    raw: {
      gt: 20
    }
  },
  hard_bounce_rate: {
    raw: {
      gt: 20
    }
  },
  soft_bounce_rate: {
    raw: {
      gt: 20
    }
  }
};

export const NOTIFICATION_CHANNEL_DATA = {
  emails: {
    icon: <EmailIcon />,
    subtitle: 'You and your team can receive alerts through email',
    fieldProps: {
      validate: ifStringPresent(emails),
      placeholder: 'example@email.com',
      multiline: true
    }
  },
  slack: {
    icon: <SlackIcon />,
    subtitle: 'Integrate this alert with Slack',
    fieldProps: {
      placeholder: 'https://hooks.slack.com/services/T00/B00/XX '
    }
  },
  webhook: {
    icon: <WebhookIcon />,
    subtitle: 'Create a webhook for this alert',
    fieldProps: {
      placeholder: 'https://example.com/webhook-target'
    }
  }
};

export const SIGNALS_FILTERS = [
  'none',
  'ip_pool',
  'mailbox_provider',
  'sending_domain'
];

export const REALTIME_FILTERS = [
  'sending_ip',
  'mailbox_provider',
  'sending_domain'
];

export const SOURCE_FRIENDLY_NAMES =
  {
    raw: 'Value',
    week_over_week: 'Week over Week',
    day_over_day: 'Day over Day'
  };

export const OPERATOR_FRIENDLY_NAMES = {
  gt: 'Above',
  lt: 'Below'
};

export const NOTIFICATION_CHANNELS = [
  'emails',
  'slack',
  'webhook'
];

export const DEFAULT_FORM_VALUES = {
  name: '',
  metric: '',
  subaccounts: [],
  sending_ip: [],
  mailbox_provider: [],
  sending_domain: [],
  single_filter: { filter_type: 'none', filter_values: []},
  source: 'raw',
  operator: 'gt',
  value: 0,
  muted: false
};
