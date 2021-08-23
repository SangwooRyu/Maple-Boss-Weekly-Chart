import { useEffect, useState } from 'react';
import labels from "./ko-map.json";

function FlowGraphsPage(props){
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

    }, []);

    return(
        <div> 
            {labels[props.boss]} {props.range}
        </div>
    );
}

export default FlowGraphsPage;