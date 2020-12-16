import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Banner, Picture } from 'src/components/matchbox';
import ConfigurationWebp from '@sparkpost/matchbox-media/images/Configuration.webp';
import { updateUserUIOptions } from 'src/actions/currentUser';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { LINKS } from 'src/constants';

export default function InfoBanner() {
  const [dismiss, setDismiss] = useState(
    useSelector(state => isUserUiOptionSet('onboardingV2.abTestingBannerDismissed')(state)),
  );
  const dispatch = useDispatch();
  const handleDismiss = () => {
    setDismiss(true);
    dispatch(updateUserUIOptions({ onboardingV2: { abTestingBannerDismissed: true } }));
  };
  if (dismiss) return null;

  return (
    <Banner
      onDismiss={handleDismiss}
      size="large"
      status="muted"
      title="Discover Better Engagement"
      backgroundColor="gray.100"
      borderWidth="100"
      borderStyle="solid"
      borderColor="gray.400"
      mb="600"
    >
      <p>
        A/B Testing uses Templates and Transmissions to create tests that reveal how variations in
        content impact recipient engagement. These tests can help identify the most effective
        content, subject lines, images, and more.
      </p>
      <Banner.Action color="blue" to={LINKS.AB_TESTING_DOCS} external variant="outline">
        A/B Testing Documentation
      </Banner.Action>
      <Banner.Media>
        <Picture seeThrough>
          <Picture.Image alt="" src={ConfigurationWebp} />
        </Picture>
      </Banner.Media>
    </Banner>
  );
}
