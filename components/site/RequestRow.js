// Third party imports
import React from 'react';
import Link from 'next/link';
import { Table, Button } from 'semantic-ui-react';

// Local imports
import web3 from '#ethereum/web3';

const RequestRow = ({ children, id, isApproving, isFinalizing, approversCount, request: { description, value: amount, recipient, approvalCount, complete }, onApprove = id => { }, onFinalize, ...props }) => {
  const { Row, Cell } = Table;

  const enableFinalize = !complete && onFinalize && (approvalCount > approversCount / 2);

  return (
    <Row disabled={complete} positive={enableFinalize}>
      <Cell>
        {id}
      </Cell>
      <Cell>
        {description}
      </Cell>
      <Cell>
        {web3.utils.fromWei(amount, 'ether')}
      </Cell>
      <Cell>
        {recipient}
      </Cell>
      <Cell>
        {approvalCount} / {approversCount}
      </Cell>
      <Cell>
        {complete ? null : (
          <Button color='green' basic loading={isApproving} onClick={onApprove.bind(undefined, id)}>Approve</Button>
        )}
      </Cell>
      <Cell>
        {enableFinalize && <Button color='teal' basic loading={isFinalizing} onClick={onFinalize.bind(undefined, id)}>Finalize</Button>}
        {/* {!enableFinalize && <Button color='teal' basic disabled>Finalize</Button>} */}
      </Cell>
    </Row>)
}


export default RequestRow;
