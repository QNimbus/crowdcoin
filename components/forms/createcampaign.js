// Third party imports
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import factory from '#ethereum/factory';

const CreateCampaignForm = ({ children, contributionCurrency = 'Wei', ...props }) => {
  const router = useRouter();

  const [minimumContribution, setMinimumContribution] = useState('100')
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async () => {
    // Already running?
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Get list of accounts (and destructure-off first account)
      const [account] = await web3.eth.getAccounts();

      // Create campaign
      await factory.methods.createCampaign(minimumContribution).send({
        from: account
      });

      // Refresh
      router.push('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={event => { event.preventDefault(); onSubmit(event); }} error={!!errorMessage}>
      <Form.Field>
        <label>Minumum Contribution</label>
        <Input label={contributionCurrency} labelPosition='right' value={minimumContribution} onChange={event => setMinimumContribution(event.target.value)} />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={isLoading}>Create</Button>
    </Form>
  );
}

export default CreateCampaignForm;