// Third party imports
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import { getCampaign } from '#ethereum/campaign';

const ContributeForm = ({ children, contributionCurrency = 'Ether', campaignAddress, ...props }) => {
  const router = useRouter();

  const [value, setValue] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const onSubmit = async (event) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Get list of accounts (and destructure-off first account)
      const [account] = await web3.eth.getAccounts();

      // Retrieve campaign contract
      const campaign = getCampaign(campaignAddress);

      // Contribute to campaign
      await campaign.methods.contribute().send({
        from: account,
        value: web3.utils.toWei(value, 'ether')
      });

      router.replace(`/campaigns/${campaignAddress}`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form onSubmit={event => { event.preventDefault(); onSubmit(event); }} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input label={contributionCurrency} labelPosition='right' onChange={event => setValue(event.target.value)} />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={isLoading}>Contribute</Button>
    </Form>
  );
}

export default ContributeForm;