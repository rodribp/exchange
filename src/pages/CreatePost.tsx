import React, { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/Provider';

const CreatePost: React.FC = () => {
  const store = useStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  const handleAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value == '' || !isNaN(parseFloat(value))) {
      setTitle(value);
    }
  }, []);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      store.createPost(title, content);
    },
    [title, content, store],
  );


  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Header className="card-header-style">Create a new Post</Card.Header>
        <Card.Body>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              value={title}
              placeholder='SATS'
              onChange={handleAmount}
              className="fControl-style"
            />
          </Form.Group>
          <Form.Group controlId="title">
            <Form.Label>Content</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="textarea-style"
            />
          </Form.Group>
        </Card.Body>
        <Card.Footer className="card-footer-style">
          <Row>
            <Col>
              <Button variant="outline-danger" onClick={store.gotoPosts} className="cst-button">
                Cancel
              </Button>
            </Col>
            <Col className="text-right">
              <Button variant="primary" type="submit" className="c-button">
                Submit
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Form>
  );
};

export default observer(CreatePost);
