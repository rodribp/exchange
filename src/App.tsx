import React, { ReactNode } from 'react';
import { Alert, Badge, Container, Dropdown, Nav, Navbar, NavLink, Button } from 'react-bootstrap';
import Confetti from 'react-confetti';
import { observer } from 'mobx-react-lite';
import Connect from './pages/Connect';
import CreatePost from './pages/CreatePost';
import PostList from './pages/PostList';
import { useStore } from './store/Provider';

function App() {
  const store = useStore();


  function CapsNode(ab: string): string {
    return ab.charAt(0).toUpperCase() + ab.slice(1);
  }
  
  const pages: Record<string, ReactNode> = {
    posts: <PostList />,
    create: <CreatePost />,
    connect: <Connect />,
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand onClick={store.gotoPosts}>
          Fili's Bitcoin Exchange
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {!store.connected ? (
              <Nav.Item>
                <NavLink onClick={store.gotoConnect}>Sign In</NavLink>
              </Nav.Item>
            ) : (
              <>
                <Navbar.Text>
                  <Badge variant="info" pill className="mr-3">
                    {store.balance.toLocaleString()} sats
                  </Badge>
                </Navbar.Text>

                <Nav.Item>
                <NavLink className="text-white">Hello! {CapsNode(store.alias)}</NavLink>
              </Nav.Item>

        
                <Button variant="outline-danger" onClick={store.disconnect} className="cst-button btn-log bg-danger">
                  Log out
              </Button> 
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="my-3">
        <div>
          {store.error && (
            <Alert variant="danger" dismissible onClose={store.clearError}>
              {store.error}
            </Alert>
          )}
          {pages[store.page]}
        </div>
      </Container>
      <Confetti numberOfPieces={store.makeItRain ? 1000 : 0} />
    </>
  );
}

export default observer(App);
