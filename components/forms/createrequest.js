// Third party imports
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';
import { getCampaign } from '#ethereum/campaign';

const CreateRequestForm = ({ children, campaignAddress, ...props }) => {
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event) => {
    // Already running?
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Get list of accounts (and destructure-off first account)
      const [account] = await web3.eth.getAccounts();

      // Retrieve campaign contract
      const campaign = getCampaign(campaignAddress);

      // Create request
      await campaign.methods.createRequest(
        description,
        web3.utils.toWei(amount, 'ether'),
        recipient
      ).send({
        from: account,
      });

      router.push(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={event => { event.preventDefault(); onSubmit(event); }} error={!!errorMessage}>
      <Form.Field>
        <label>Description</label>
        <Input value={description} onChange={e => setDescription(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <label>Amount in Ether</label>
        <Input value={amount} onChange={e => setAmount(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <label>Recipient</label>
        <Input value={recipient} onChange={e => setRecipient(e.target.value)} />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button primary loading={isLoading}>Create</Button>
    </Form>
  );
}

export default CreateRequestForm;