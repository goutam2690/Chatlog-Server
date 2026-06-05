import { Line, Doughnut, Chart } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend } from 'chart.js'
import { darkPink, purple, purpleLight } from '../../constants/color';
import { getPast7Days } from '../../lib/features';



ChartJS.register(CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend);

const labels = getPast7Days();

const LineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false
        }

    },

    Scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            }
        }
    }
}

const DoughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false
        }

    },

    cutout: 70,
}

export const LineChart = ({ value = [] }) => {

    const data = {
        labels,
        datasets: [{
            data: value,
            label: "Messages",
            fill: true,
            backgroundColor: purpleLight,
            borderColor: purple
        }]
    }

    return <Line data={data} options={LineChartOptions} />
}

export const DoughnutChart = ({ value = [], labels = [] }) => {

    const data = {
        labels,
        datasets: [{
            data: value,
            backgroundColor: [purple, darkPink],
            borderColor: [purple, darkPink],
            offset: 20
        }]
    }

    return <Doughnut style={{ zIndex: 10}} data={data} options={DoughnutChartOptions} />
}
