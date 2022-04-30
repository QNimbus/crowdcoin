// Third party imports
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Card, Grid, Button } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import CreateRequestForm from '#forms/createrequest';
import { getCampaign } from '#ethereum/campaign';

const pageTitle = "New campaign request";

const NewRequest = (props) => {
  const { address } = props;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="title" property="og:title" content={pageTitle} />
      </Head>
      <Link href={`/campaigns/${address}/requests`} passHref>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <CreateRequestForm campaignAddress={address} />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { address } = context.params;;

  return {
    props: {
      address
    },
  }
};

export default NewRequest;