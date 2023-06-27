import React, { useState } from 'react';
import { Button, Form, Jumbotron } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import PayModal from '../components/PayModal';
import PostCard from '../components/PostCard';
import { useStore } from '../store/Provider';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { getPreEmitDiagnostics } from 'typescript';

const PostList: React.FC = () => {
  const store = useStore();

  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [daysAgo, setDays] = useState(0);
  
  const getPrices = async (daysAgo: string, nCase: number) => {
    const url1 = 'https://coingecko.p.rapidapi.com/coins/bitcoin/history?date=26-06-2023';
    const url = 'https://coingecko.p.rapidapi.com/coins/bitcoin/market_chart?vs_currency=usd&days=' + daysAgo;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '331c26402bmsh814bf6ff7cf70cfp120febjsna7638fcbf46e',
        'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
      }
    };
    if (nCase == 1) {
      await fetch(url, options).then(function (request) {
        if (request.ok) {
          request.json().then(function (response) {
            setData(response.prices)
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

  getPrices('', 2);
  return (
    <>
      <h2>
        Price of Bitcoin $ {currentPrice}
        <Button variant="success" className="mr-2 float-right">
          Comprar
        </Button>
      </h2>
      
      <AreaChart width={1100} height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <YAxis allowDecimals={true} dataKey="1"/>
        <Tooltip />
        <Area type="monotone" dataKey="1" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      </AreaChart>

      {/* Buttons */}
      <div className="btn-toolbar container" role="toolbar" aria-label="Toolbar with button groups">
          <button type="button" onClick={(() => getPrices('1', 1))} className="btn col-1 btn-secondary">1D</button>
          <button type="button" onClick={(() => getPrices('7', 1))} className="btn col-1 offset-1 btn-secondary">1W</button>
          <button type="button" onClick={(() => getPrices('30', 1))} className="btn col-1 offset-1 btn-secondary">1M</button>
          <button type="button" onClick={(() => getPrices('365', 1))} className="btn col-1 offset-1 btn-secondary">1Y</button>
          <button type="button" onClick={(() => getPrices('1825', 1))} className="btn col-1 offset-1 btn-secondary">5Y</button>
        <div className="input-group offset-1 col-2">
          <div className="input-group-prepend">
            <div className="input-group-text" id="btnGroupAddon">#</div>
          </div>
          <input onChange={(e => getPrices(e.target.value, 1))} type="number" className="form-control" placeholder="Days ago" aria-label="Input group example" aria-describedby="btnGroupAddon"/>
        </div>
      </div>
    </>
  );
};

export default observer(PostList);
