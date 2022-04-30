// Third party imports
import Link from 'next/link';
import Head from 'next/head';
import { Button, Card } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';

// Local imports
import factory from '#ethereum/factory';

const pageTitle = "Campaigns";

const CampaignIndex = (props) => {
  const [campaigns] = useState(props.campaigns);

  useEffect(() => {
    return function cleanup() { };
  }, [])

  const items = campaigns.map(address => {
    return {
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      fluid: true
    }
  });

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="title" property="og:title" content={pageTitle} />
      </Head>
      <h3>Active Campaigns</h3>
      <Link href='/campaigns/new' passHref>
        <Button floated="right" content='Create Campaign' icon='add circle' labelPosition='left' primary />
      </Link>
      <Card.Group items={items} />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    },
  }
};

export default CampaignIndex;