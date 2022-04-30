// Third party imports
import React from 'react';
import Head from 'next/head';

// Local imports
import CreateCampaignForm from '#forms/createcampaign';

const pageTitle = "Create Campaign";

const CampaignNew = (props) => {

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="title" property="og:title" content={pageTitle} />
      </Head>
      <h3>Create a Campaign</h3>
      <CreateCampaignForm />
    </>
  );
}

export default CampaignNew;