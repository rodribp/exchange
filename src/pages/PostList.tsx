import React, { useState, useCallback } from 'react';
import { Button, Form, Jumbotron} from 'react-bootstrap';
import { observer, useAsObservableSource } from 'mobx-react-lite';
import PayModal from '../components/PayModal';
import PostCard from '../components/PostCard';
import { useStore } from '../store/Provider';
import { YAxis, Tooltip, AreaChart, Area  } from 'recharts';
import QRCode from 'react-qr-code';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

const PostList: React.FC = () => {
  
  const store = useStore();
  const [data, setData] = useState([{}]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [paymentReq, setPaymentReq] = useState('');
  // modal
  const [lgShow, setLgShow] = useState(false);
  
  /* Creating connection to coingeko */
  const getPrices = async (daysAgo: string, nCase: number) => {
    const url1 = 'https://coingecko.p.rapidapi.com/coins/bitcoin/history?date=26-06-2023';
    const url = 'https://coingecko.p.rapidapi.com/coins/bitcoin/market_chart?vs_currency=usd&days=' + daysAgo;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '2961ee6301msh0d55c5b877d030cp1bc286jsn2b21cea9e70e',
        'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
      }
    };
    if (nCase == 1) {
      await fetch(url, options).then(function (request) {
        if (request.ok) {
          request.json().then(function (response) {
            setData(response.prices);
          });
        } else {
          console.log(request.status + " " + request.statusText)
        }
      });
    } else if (nCase == 2) {
      await fetch(url1, options).then(function (request) {
        if (request.ok) {
          request.json().then(function (response) {
            setCurrentPrice((response.market_data.current_price.usd).toFixed(2))
          });
        } else {
          console.log(request.status + " " + request.statusText)
        }
      });
    }
    
  }

  //show the price
  getPrices('', 2);

  

  // create an invoice and show the modal when the button is clicked
  const generateInvoice = useCallback(async () => {
    await store.createInvoiceAmt(2000);
    setPaymentReq(store.pmtRequest);
    setLgShow(true)
  }, [store]);

  const verifyPayment = useCallback(async () =>  {
      await store.verifyPayment();
  }, [store]);

  // Generate and Show the Qr Code
  const showInvoice = !store.pmtSuccessMsg ? (
    <div className="container">
      <div className='row'>
        <div className='col-6'>
          <p className='text-break' id='text'>{paymentReq}</p>
        </div>
        <div className='col-4' style={{height: "auto", maxWidth: 64, width: "100%"}}>
          <QRCode value={paymentReq} size={256} viewBox={`0 0 256 256`} />
        </div>
      </div>
    </div>
  ) : (
    <div className="container">
      <div className='row'>
        <div className='col-12'>
          <div className='alert alert-success' role='alert'>
            {store.pmtSuccessMsg}
            <p>Here's the <a target='_blank' href='https://drive.google.com/file/d/13GyToJDwMcEuF6EEjGAv6o67xP6diGSr/view?usp=drive_link'>link</a> to the book, we hope you to enjoy it :)</p>
          </div>
        </div>
      </div>
    </div>
  )
  




  return (
    <>
      <h2>
        Price of Bitcoin $ {currentPrice}
      </h2>
      {/* Chart */}
      <AreaChart width={1100} height={250} data={data} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <YAxis allowDecimals={false} type="number" hide={true} domain={['dataMin', 'dataMax']}/>
        <Tooltip />
        <Area type="monotone" dataKey="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>

      {/* Buttons */}
      <div className="btn-toolbar container " role="toolbar" aria-label="Toolbar with button groups" style={{margin : "auto"}}>
        <button type="button" onClick={() => getPrices('1', 1)} className="btn col-1 btn-secondary">1D</button>
        <button type="button" onClick={() => getPrices('7', 1)} className="btn col-1 offset-1 btn-secondary">1W</button>
        <button type="button" onClick={() => getPrices('30', 1)} className="btn col-1 offset-1 btn-secondary">1M</button>
        <button type="button" onClick={() => getPrices('365', 1)} className="btn col-1 offset-1 btn-secondary">1Y</button>
        <button type="button" onClick={() => getPrices('1825', 1)} className="btn col-1 offset-1 btn-secondary">5Y</button>
      </div>
      <br/>
      {/* Books Tittle */}
      <h2>Choose and Buy a Book</h2>

      {/* Books */}
      <div className='books-info'>
        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1588843906l/52861201._SY475_.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>From Blood and Ash</Card.Title>
              <Card.Text className="card-text">
                <h6 className='author'>Jennifer L. Armentrou</h6>
                From Blood and Ash follows the Maiden, a girl named Poppy who is fated to Ascend soon. 
                She isn't allowed to speak to or touch anyone but a select few. But a mysterious man 
                named Hawke becomes her guard, and when attacks from supernatural creatures become more 
                common, she is forced to trust him.
                <h6 className='rating'>4.26⭐</h6>
              </Card.Text>
              <div className='container-btns'>
              <span className='input-group-text text-center' id='basic-addon1'>2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1624553583i/58371432.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>The Book of Cold Cases</Card.Title>
              <Card.Text className="card-text">
                <h6  className='author'>St. James, Simone</h6>
                  The Book of Cold Cases is St. James at the top of her game,expertly weaving the past 
                  and the present to reveal a chilling tapestry of real world mystery and supernatural 
                  suspense that will have you turning pages well past your bedtime and jumping at every 
                  little sound.
                <h6 className='rating'>3.91⭐</h6>
              </Card.Text>
              <div  >
              <span className='input-group-text text-center' id='basic-addon1'>2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1635862579i/58064046.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>Gallant</Card.Title>
              <Card.Text className="card-text">
                <h6  className='author'>V. E. Schwab</h6>
                Is a gothic tale of a place where shadows meet light and death meets life. 
                When Olivia Prior is summoned to her family's home after a lifetime spent 
                in an orphanage, she's determined to understand what drove her mother, and 
                countless other family members, to the edge.
                <h6  className='rating'>3.9⭐</h6>
              </Card.Text>
              <div >
              <span className='input-group-text text-center' id='basic-addon1' >2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
              </div>
              
              
            </Card.Body>
          </Card>
        </div>

        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://m.media-amazon.com/images/I/417-MNeiHqL._SX311_BO1,204,203,200_.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>The Blocksize War</Card.Title>
              <Card.Text className="card-text">
                <h6  className='author'>Jonathan Bier</h6>
                This book covers Bitcoin’s blocksize war, which was waged from August 2015 to November 2017. 
                On the surface the battle was about the amount of data allowed in each Bitcoin block, however 
                it exposed much deeper issues, such as who controls Bitcoin’s protocol rules. It is not possible 
                to cover every twist and turn in the labyrinthine conflict or all the arguments, but I have 
                provided a chronology of the most significant events. This book explores some of the major 
                characters in the conflict and includes coverage, from both the front lines and behind the scenes, 
                during some of the most acute phases of the struggle.
                <h6  className='rating'>4.7⭐</h6>
              </Card.Text>
              
              <span className='input-group-text text-center' id='basic-addon1'>2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://m.media-amazon.com/images/I/51Nx2W0cQML._SX322_BO1,204,203,200_.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>Layered Money: From Gold and Dollars to Bitcoin and Central Bank Digital Currencies</Card.Title>
              <Card.Text className="card-text">
                <h6  className='author'>Nikhil Bhatia</h6>
                In this fascinating deep dive into the evolution of monetary systems around the globe, 
                Nik Bhatia takes us into the origins of how money has evolved to function in a "layered" 
                manner. Using gold as an example of this term, he traces the layers of this ancient currency 
                from raw mined material, to gold coins, and finally to bank-issued gold certificates. In a 
                groundbreaking manner, Bhatia offers a similar paradigm for the evolution of digital currencies.
                <h6  className='rating'>4.7⭐</h6>
              </Card.Text>
              <span className='input-group-text text-center' id='basic-addon1'>2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className='book-info'>
          <Card className='custom-card' style={{ width: '18rem' }}>
            <Card.Img className='card-img' variant="top" src="https://m.media-amazon.com/images/I/41C7TkN5KeL._SX331_BO1,204,203,200_.jpg" />
            <Card.Body>
              <Card.Title className='card-title'>The Price of Tomorrow</Card.Title>
              <Card.Text className="card-text">
                <h6  className='author'> Jeff Booth</h6>
                We live in an extraordinary time. Technological advances are happening at a rate faster than our 
                ability to understand them, and in a world that moves faster than we can imagine, we cannot afford 
                to stand still. These advances bring efficiency and abundance and they are profoundly deflationary. 
                Our economic systems were built for a pre-technology era when labour and capital were inextricably 
                linked, an era that counted on growth and inflation, an era where we made money from inefficiency.
                <h6  className='rating'>4.6⭐</h6>
              </Card.Text>
              <span className='input-group-text text-center' id='basic-addon1'>2,000 SATS</span>
              <Button className='buy-button col-12' aria-describedby='basic-addon1'  variant="primary" onClick={generateInvoice}>
                Buy
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal that show the invoice and Qr Code */}
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Pay the invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          {showInvoice} 
        </Modal.Body>
        <Modal.Footer>
          Once you've paid press the following button
          <Button onClick={verifyPayment}>Verify</Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
};

export default observer(PostList);
