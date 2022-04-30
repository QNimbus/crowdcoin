// Third party imports
import Link from 'next/link'
import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';

const Header = ({ children, ...props }) => {
  const [activeItem, setActiveItem] = useState();

  return (<div id="header" {...props}>
    <Menu style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <Link href='/' passHref>
        <Menu.Item>Crowd Coin</Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link href='/' passHref>
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href='/campaigns/new' passHref>
          <Menu.Item>+</Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  </div>);
};

export default Header;
