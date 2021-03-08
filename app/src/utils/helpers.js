const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const getCardHeightBySize = (size) => {
    switch(size){
        case 'm': return 125;
        case 'l': return 250;
    }
}

export {
    sleep,
    getCardHeightBySize
}