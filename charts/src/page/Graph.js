import { Bar } from "react-chartjs-2";
import { useEffect, useState } from 'react';

function Graph(props){
    const data = {
        labels: Object.keys(props.input),
        datasets: [
          {
            label: '가격',
            data: Object.values(props.input),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 0.5,
          }
        ],
      };

    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      
    useEffect(() => {
        //console.log(props.input)
    }, []);

    return(
        <Bar data={data} options={options} />
    );
}

export default Graph;