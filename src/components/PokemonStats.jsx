import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import '../styles/stats.css';

// Registra los componentes necesarios de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChart = ({ data }) => {
  const options = {
    indexAxis: 'y', // Eje horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 0 // Tamaño de fuente de la leyenda
          }
        }
      },
      title: {
        display: true,
        text: "Stats",
        font: {
          size: 40 // Tamaño de la fuente del título
        }
      },
      datalabels: {
        anchor: 'center', // Cambia a 'center' para centrar los labels dentro de las barras
        align: 'center', // Alinea al centro
        color: '#fff', // Color blanco para contraste con colores oscuros de fondo
        font: {
          weight: 'bold',
          size: 16 // Tamaño de fuente para que sea legible
        },
        formatter: (value, context) => {
          return value; // Puedes formatear el valor aquí si es necesario
        }
      }
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 24 // Tamaño de la fuente de los ticks del eje y
          }
        }
      }
    }
  };
  const backgroundColor =[]
  if(data.values){
    data.values.forEach(value => {
      if(value <=40) backgroundColor.push('rgb(163, 30, 30)');
      else if(value <70) backgroundColor.push('rgb(221, 145, 44)');
      else if(value <100) backgroundColor.push('rgb(227, 202, 17)');
      else if(value <120) backgroundColor.push('rgb(81, 158, 37)');
      else backgroundColor.push('rgb(90, 184, 234)');
    });
  }
  
  
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: backgroundColor ||[
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};



export function PokemonStats({ stats }) {
  const [pokemonStats, setPokemonStats] = useState({});

  useEffect(() => {
    const formattedData = {
      labels: stats.map((stat) => stat.stat.name.replace("-", " ")),
      values: stats.map((stat) => stat.base_stat),
    };
    //capitalice labels
    formattedData.labels = formattedData.labels.map((label) =>
      label.charAt(0).toUpperCase() + label.slice(1)
    );
    setPokemonStats(formattedData);
  }, [stats]);

  return (
    <div className="statsContainer" >
      <BarChart data={pokemonStats} />
    </div>
  );
}
