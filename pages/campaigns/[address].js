// Third party imports
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Card, Grid, Button } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import ContributeForm from '#forms/contribute';
import { getCampaign } from '#ethereum/campaign';

const pageTitle = "Campaign details";

const Campaign = (props) => {
  const { address, minimumContribution, balance, manager, requestsCount, approversCount } = props;
  const items = [
    {
      header: manager,
      meta: 'Address of manager',
      description: 'The manager created this campaign and can create requests to withdraw money.',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: minimumContribution,
      meta: 'Minimum Contribution (Wei)',
      description: 'You must contribute at least this much Wei to become an approver.',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: requestsCount,
      meta: 'Number of Requests',
      description: 'A request tries to withdraw money from the contract. Requests must be approved by approvres.',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: approversCount,
      meta: 'Number of Approvers',
      description: 'Number of people who have already donated to the campaign.',
      style: { overflowWrap: 'break-word' }
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description: 'The balance is how much money this campaign has left to spend.',
      style: { overflowWrap: 'break-word' }
    },
  ]

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="title" property="og:title" content={pageTitle} />
      </Head>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddress={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`} passHref>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { address } = context.params;

  const campaign = getCampaign(address);
  const campaignSummary = await campaign.methods.getSummary().call();

  const {
    '0': minimumContribution,
    '1': balance,
    '2': requestsCount,
    '3': approversCount,
    '4': manager
  } = campaignSummary;

  return {
    props: {
      address,
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    },
  }
};

export default Campaign;