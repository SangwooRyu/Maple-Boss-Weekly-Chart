import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Graph from './Graph';
import labels from "./ko-map.json";


function GraphsPage(){
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    async function fetchCsv() {
        const response = await fetch('/Maple-Boss-Weekly-Chart/data/20210812.csv');
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
            const data = await Papa.parse(await fetchCsv());
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
    }, []);


    return(
        loading?
        <div /> : 
        <Graph input={data}/>
    );
}

export default GraphsPage;