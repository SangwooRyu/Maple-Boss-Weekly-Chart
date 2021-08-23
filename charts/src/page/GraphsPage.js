import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Graph from './Graph';
import labels from "./ko-map.json";


function GraphsPage(props){
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    async function fetchCsv(filename) {
        const response = await fetch('/Maple-Boss-Weekly-Chart/data/' + filename);
        // console.log(response);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = await decoder.decode(result.value);
        return csv;
    }
    
    function formGraphInput(boss_name) {

    }
    
    useEffect(() => {
        async function loadCsv() {
            setLoading(true);
            var prevThursday = props.date.toDate();
            prevThursday.setDate(prevThursday.getDate() - (prevThursday.getDay() + 3) % 7);
            let year = prevThursday.getFullYear().toString();
            let month = prevThursday.getMonth() < 10? '0' + (prevThursday.getMonth() + 1).toString() : (prevThursday.getMonth() + 1).toString();
            let date = prevThursday.getDate() < 10? '0' + prevThursday.getDate().toString() : prevThursday.getDate().toString();
            
            let targetFileName = year + month + date;
            if (parseInt(targetFileName) < 20210812)
                targetFileName = '20210812';
            targetFileName += '.csv';
            //console.log(targetFileName); 

            const data = await Papa.parse(await fetchCsv(targetFileName));
            var refined_data = data.data.reduce(function (pre, value){
                if (value[0] === "Boss" || value[0] === "")
                    return pre;
                else
                    pre.push([labels[value[0]], parseInt(value[1])])
                return pre;
            }, []);
            //console.log(refined_data);
            const obj = Object.fromEntries(refined_data);
            setData(obj);
            setLoading(false);
        }
        loadCsv();
        // console.log(labels);
    }, [props.date]);


    return(
        loading?
        <div /> : 
        <Graph input={data}/>
    );
}

export default GraphsPage;