import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import React from 'react';
import { TxsOverTime } from './DataTypes';
import moment from 'moment'

const BTCMinedChart = () =>  {
  const [btcMinedData, setBTCMinedOverTime] = React.useState<Array<TxsOverTime> | undefinedfiundefined(null);

  React.useEffect(() => {
    (async () => {
      const res = await (
        await fetch("http://www.localhost:5010/dashboard/txsovertime")
      ).json();
      setBTCMinedOverTime([...res.message]);
    })();
  }, []);

  if (btcMinedData) {
    for (let btcMined of btcMinedData) {
      btcMined['date'] = String(moment(btcMined['date']).utc().format('YYYY-MM-DD'));
    }
  }

  return (
    <ResponsiveContainer width="80%" aspect={3}>
      <LineChart
        width={500}
        data={btcMinedData || []}
        margin={{ top: 10, right: 30, left: 50, bottom: 50 }}
      >
        <XAxis
          dataKey="date"
          dy={10}
          tick={{fill:"#fff", fontSize: 14, opacity: .75}}
          label={{ value: 'Date', position: 'outsideBottomRight', fill: '#fff',  dy: 35, offset: 0, opacity: .75 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          dx={-10}
          label={{ value: 'Total Transactions', fill: '#fff', dx: -70, angle: -90, position: 'outsideLeft', opacity: .75 }}
          tick={{fill:"#fff", fontSize: 14, opacity: .75}}
        />
        <CartesianGrid
          vertical={false}
          stroke="#aab8c2"
          opacity={.15}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#1d1f31", color: "#fff" }}
          itemStyle={{ color: "#fff" }}
          cursor={false}
          label="{Date}"
          labelFormatter={(name) => 'Time Taken : ' + name}
        />
        <Line
          type="monotone"
          stroke="#268c62"
          name="Total Transactions"
          dataKey="num_of_txs"
          strokeWidth="2.5"
          dot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 2,r:5}}
          activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 2,r:5}} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default BTCMinedChart;
