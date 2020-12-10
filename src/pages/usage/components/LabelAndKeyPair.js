import React from 'react';
import { LabelValue } from 'src/components/matchbox';

export default function LabelAndKeyPair({ label, value }) {
  return (
    <LabelValue dark>
      <LabelValue.Label>{label}</LabelValue.Label>
      <LabelValue.Value>{value}</LabelValue.Value>
    </LabelValue>
  );
}
