// Third party imports
import React from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';

// Local imports
import Header from '#site/Header.js'
import Footer from '#site/Footer.js'

const Layout = ({ children, ...props }) => (
  <Container {...props}>
    <Head>
      <meta key="viewport" name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    {children}
    <Footer />
  </Container>
)


export default Layout;
