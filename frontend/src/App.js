import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import DeleteUser from './components/UserComponents/DeleteUser';
import UpdateUser from './components/UserComponents/UpdateUser';
import DeleteOrder from './components/OrderComponents/DeleteOrder';
import UpdateOrder from './components/OrderComponents/UpdateOrder';
import './App.css'; // CSS dosyasını ekle

function App() {
  const [users, setUsers] = useState([]); // Kullanıcı listesini tutar
  const [orders, setOrders] = useState([]); // Sipariş listesini tutar
  const [nickname, setNickname] = useState(''); // Kullanıcı nickname
  const [name, setName] = useState(''); // Kullanıcı adı
  const [email, setEmail] = useState(''); // Kullanıcı email
  const [description, setDescription] = useState(''); // Sipariş açıklaması
  const [amount, setAmount] = useState(''); // Sipariş miktarı
  const [userId, setUserId] = useState(''); // Kullanıcı ID

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  // Kullanıcıları getiren fonksiyon
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Kullanıcılar getirilirken bir hata oluştu:', error);
    }
  };

  // Siparişleri getiren fonksiyon
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Siparişler getirilirken bir hata oluştu:', error);
    }
  };

  // Yeni kullanıcı ekleyen fonksiyon
  const addUser = async (e) => {
    e.preventDefault(); // form gönderildiğinde sayfanın yenilenmesini önlemek
    try {
      await axios.post('http://localhost:8080/users', { nickname, name, email });
      fetchUsers();
      setNickname('');
      setName('');
      setEmail('');
      alert('Kullanıcı başarıyla eklendi!');
    } catch (error) {
      console.error('Kullanıcı eklenirken bir hata oluştu:', error);
    }
  };

  // Yeni sipariş ekleyen fonksiyon
  const addOrder = async (e) => {
    e.preventDefault();
    console.log({ description, amount, userId }); // Verilerin doğru gelip gelmediğini kontrol etmek için
    try {
      await axios.post('http://localhost:8081/orders', { description, amount, userId });
      fetchOrders();
      setDescription('');
      setAmount('');
      setUserId('');
      alert('Sipariş başarıyla eklendi!');
    } catch (error) {
      console.error('Sipariş eklenirken bir hata oluştu:', error);
    }
  };

  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home" style={{ paddingLeft: '10px' }}>Kullanıcı ve Sipariş Yönetimi</Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: '20px' }}>
        <Row>
          <Col md={5} className="bordered-container">
            <h2>Kullanıcı Ekle</h2>
            <Form onSubmit={addUser}>
              <Form.Group controlId="formNickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nickname giriniz"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formName">
                <Form.Label>İsim</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="İsim giriniz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email giriniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px', alignSelf: 'flex-end' }}>
                Ekle
              </Button>
            </Form>
          </Col>
          <Col md={1}></Col> {/* Boşluk için boş bir kolon ekledik */}
          <Col md={5} className="bordered-container">
            <h2>Sipariş Ekle</h2>
            <Form onSubmit={addOrder}>
              <Form.Group controlId="formUserId">
                <Form.Label>Kullanıcı Seçin</Form.Label>
                <Form.Control
                  as="select"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                >
                  <option value="">Kullanıcı Seçin</option>
                  {users.map((user) => (
                    <option key={user.nickname} value={user.nickname}>
                      {user.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Açıklama</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ürün giriniz"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Miktar</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Miktar giriniz"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required // girilmesi zorunlu alan
                />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Ekle
              </Button>
            </Form>
          </Col>
        </Row>

        <Row style={{ marginTop: '20px' }}>
          <Col md={5} className="bordered-container">
            <h2 className="mb-4">Kullanıcılar</h2>
            <ListGroup>
              {users.map((user) => (
                <ListGroup.Item key={user.nickname} className="p-3 mb-2">
                  <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>{user.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{user.nickname}</Card.Subtitle>
                        <Card.Text>{user.email}</Card.Text>
                      </div>
                      <div>
                        <UpdateUser user={user} fetchUsers={fetchUsers} nickname={user.nickname} />
                        <DeleteUser nickname={user.nickname} fetchUsers={fetchUsers} />
                      </div>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={1}></Col> {/* Boşluk için boş bir kolon ekledik */}
          <Col md={5} className="bordered-container">
            <h2 className="mb-4">Siparişler</h2>
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order.id} className="p-3 mb-2">
                  <Card>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>{order.description}</Card.Title>
                        <Card.Text>
                          <strong>Miktar:</strong> {order.amount}<br />
                          <strong>Kullanıcı ID:</strong> {order.userId}
                        </Card.Text>
                      </div>
                      <div>
                        <UpdateOrder order={order} fetchOrders={fetchOrders}  />
                        <DeleteOrder orderId={order.id} fetchOrders={fetchOrders} />
                      </div>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;