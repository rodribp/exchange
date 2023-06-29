import React, { ReactNode } from 'react';
import { Alert, Badge, Container, Dropdown, Nav, Navbar, NavLink, Button, Image } from 'react-bootstrap';
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
        <Navbar.Brand className="text-warning" onClick={store.gotoPosts}>
          Fili's Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <img src='https://cdn-icons-png.flaticon.com/512/6211/6211426.png' className='img-fluid' alt='Response image' width={50}></img>
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
