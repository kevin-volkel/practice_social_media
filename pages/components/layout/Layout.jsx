import HeadTag from './HeadTag';
import Navbar from './Navbar';
import { Container, Grid, Ref, Sticky, Visibility } from 'semantic-ui-react';
import nprogress from 'nprogress';
import Router from 'next/router';
import { createRef } from 'react';
import SideMenu from './SideMenu';
import SearchComponent from './SearchComponent';

const Layout = ({ children, user }) => {
  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  //! createRef refreshes on render()
  //! useRef refreshes on router.reload() page refresh
  const contextRef = createRef();

  return (
    <>
      <HeadTag />
      {user ? (
        <>
          <div style={{ marginLeft: '1rem', marginRight: '1rem', marginTop: '2rem' }}>
            <Ref innerRef={contextRef}>
              <Grid>
                <Grid.Column width={2}>
                  <Sticky context={contextRef}>
                    <SideMenu user={user}/>
                  </Sticky>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Visibility context={contextRef}>
                    {children}
                  </Visibility>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Sticky context={contextRef}>
                    <SearchComponent/>
                  </Sticky>
                </Grid.Column>
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Container style={{ paddingTop: '1rem' }} text>
            {children}
          </Container>
        </>
      )}
    </>
  );
};

export default Layout;
