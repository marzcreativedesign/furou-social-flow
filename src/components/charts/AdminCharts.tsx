
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartBarChart,
  Line,
  LineChart as RechartLineChart,
  Pie,
  PieChart as RechartPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Dados simulados para os gráficos
const userRegistrationData = [
  { name: 'Jan', usuarios: 4 },
  { name: 'Fev', usuarios: 7 },
  { name: 'Mar', usuarios: 5 },
  { name: 'Abr', usuarios: 8 },
  { name: 'Mai', usuarios: 12 },
  { name: 'Jun', usuarios: 14 },
  { name: 'Jul', usuarios: 19 },
  { name: 'Ago', usuarios: 22 },
  { name: 'Set', usuarios: 25 },
  { name: 'Out', usuarios: 28 },
  { name: 'Nov', usuarios: 30 },
  { name: 'Dez', usuarios: 35 },
];

const eventCategoryData = [
  { name: 'Festas', value: 45 },
  { name: 'Esportes', value: 25 },
  { name: 'Cultural', value: 15 },
  { name: 'Outros', value: 15 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const monthlyActivityData = [
  {
    name: 'Jan',
    eventos: 20,
    usuarios: 4,
    acessos: 40,
  },
  {
    name: 'Fev',
    eventos: 22,
    usuarios: 7,
    acessos: 52,
  },
  {
    name: 'Mar',
    eventos: 25,
    usuarios: 5,
    acessos: 61,
  },
  {
    name: 'Abr',
    eventos: 28,
    usuarios: 8,
    acessos: 70,
  },
  {
    name: 'Mai',
    eventos: 30,
    usuarios: 12,
    acessos: 85,
  },
  {
    name: 'Jun',
    eventos: 35,
    usuarios: 14,
    acessos: 92,
  },
];

export const LineChart = () => {
  return (
    <ChartContainer className="h-full w-full" config={{
      usuarios: { 
        theme: { 
          light: "#7E69AB",
          dark: "#9b87f5" 
        }
      }
    }}>
      <RechartLineChart data={userRegistrationData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #ddd)" />
        <XAxis dataKey="name" stroke="var(--color-text, #888)" />
        <YAxis stroke="var(--color-text, #888)" />
        <Tooltip />
        <Line type="monotone" dataKey="usuarios" name="Usuários" stroke="var(--color-usuarios, #9b87f5)" strokeWidth={2} dot={{ r: 4 }} />
      </RechartLineChart>
    </ChartContainer>
  );
};

export const PieChart = () => {
  return (
    <ChartContainer className="h-full w-full" config={{}}>
      <RechartPieChart>
        <Pie
          data={eventCategoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {eventCategoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartPieChart>
    </ChartContainer>
  );
};

export const BarChart = () => {
  return (
    <ChartContainer className="h-full w-full" config={{
      eventos: {
        theme: { 
          light: "#2563eb",
          dark: "#3b82f6" 
        }
      },
      usuarios: { 
        theme: { 
          light: "#7E69AB",
          dark: "#9b87f5" 
        }
      },
      acessos: { 
        theme: { 
          light: "#10b981",
          dark: "#34d399" 
        }
      }
    }}>
      <RechartBarChart
        data={monthlyActivityData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #ddd)" />
        <XAxis dataKey="name" stroke="var(--color-text, #888)" />
        <YAxis stroke="var(--color-text, #888)" />
        <Tooltip />
        <Legend />
        <Bar dataKey="eventos" name="Eventos" fill="var(--color-eventos, #3b82f6)" />
        <Bar dataKey="usuarios" name="Novos Usuários" fill="var(--color-usuarios, #9b87f5)" />
        <Bar dataKey="acessos" name="Acessos" fill="var(--color-acessos, #34d399)" />
      </RechartBarChart>
    </ChartContainer>
  );
};
