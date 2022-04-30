// Third party imports
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import RequestRow from '#site/RequestRow';
import { getCampaign } from '#ethereum/campaign';

const pageTitle = "Campaign requests";

const RequestIndex = (props) => {
  const router = useRouter();
  const { address, manager, requests, requestsCount, approversCount } = props;
  const { Header, Row, HeaderCell, Body } = Table;

  const [rowApproving, setRowApproving] = useState(-1);
  const [rowFinalizing, setRowFinalizing] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');
  const [account, setAccount] = useState({ address: '', isManager: false });

  useEffect(() => {
    (async () => {
      // Get list of accounts (and destructure-off first account)
      let [address] = await web3.eth.getAccounts();
      setAccount({ address, isManager: manager == address });
    })();
  }, []);

  const onApprove = async id => {
    try {
      setRowApproving(id);
      setErrorMessage('');

      // Retrieve campaign contract
      const campaign = getCampaign(address);

      // Approve request
      await campaign.methods.approveRequest(id).send({
        from: account.address
      });

      // Refresh
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setRowApproving(-1);
    }
  };

  const onFinalize = async id => {
    try {
      setRowFinalizing(id);
      setErrorMessage('');

      // Retrieve campaign contract
      const campaign = getCampaign(address);

      // Approve request
      await campaign.methods.finalizeRequest(id).send({
        from: account.address
      });

      // Refresh
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setRowFinalizing(-1);
    }
  };

  // Map over all the requests and output table row
  const renderRows = () => requests.map((request, index) => <RequestRow key={index} id={index} request={request} address={address} approversCount={approversCount} onApprove={onApprove} onFinalize={account.isManager ? onFinalize : undefined} isApproving={rowApproving == index} isFinalizing={rowFinalizing == index} />);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="title" property="og:title" content={pageTitle} />
      </Head>
      <Link href={`/campaigns/${address}`} passHref>
        <a>Back</a>
      </Link>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`} passHref>
        <Button primary floated="right" style={{ marginBottom: '1rem' }}>Add Request</Button>
      </Link>
      {errorMessage && <Message error header="Oops!" content={errorMessage} />}
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {renderRows()}
        </Body>
      </Table>
      <div>Found {requestsCount} request(s)</div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { address } = context.params;

  // Retrieve campaign contract
  const campaign = getCampaign(address);

  // Get total number of requests
  const requestsCount = await campaign.methods.getRequestsCount().call();

  // Get total number of approvers
  const approversCount = await campaign.methods.approversCount().call();

  // Get manager
  const manager = await campaign.methods.manager().call();

  // Get all requests
  const requests = await Promise.all(
    Array(parseInt(requestsCount)).fill().map((_, index) => campaign.methods.requests(index).call())
  );

  return {
    props: {
      address,
      requests: JSON.parse(JSON.stringify(requests)),
      manager,
      requestsCount,
      approversCount,
    },
  }
};

export default RequestIndex;