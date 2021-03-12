const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const getCardHeightBySize = (size) => {
    switch (size) {
        case 'm': return 125;
        case 'l': return 250;
    }
}

const getUrlByJson = (obj) => {
    const url = new URLSearchParams();

    const generateUrl = (obj) => {
        for (let [ key, value ] of Object.entries(obj)) {
            if(typeof value === 'object' && value !== null && !Array.isArray(value)) generateUrl(value)
            else if (value !== null){
                if(Array.isArray(value) && value.length) url.append(key, value);
                else if(typeof value === 'number') url.append(key, value);
            } 
        }
    }

    generateUrl(obj);
    
    let allParams = url.toString();
    if(allParams.length) allParams = `?${allParams}`;

    allParams = decodeURIComponent(allParams);

    return allParams;
}

export {
    sleep,
    getCardHeightBySize,
    getUrlByJson
}