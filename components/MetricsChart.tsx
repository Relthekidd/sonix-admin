import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", streams: 4000 },
  { name: "Feb", streams: 3000 },
  { name: "Mar", streams: 5000 },
  { name: "Apr", streams: 4780 },
  { name: "May", streams: 5890 },
  { name: "Jun", streams: 4390 },
];

export function MetricsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="streams" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
