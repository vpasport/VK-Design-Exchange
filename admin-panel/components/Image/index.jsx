import { useState, useEffect } from 'react';

import { Skeleton } from 'primereact/skeleton';

const MyImage = ({ path }) => {
    const [loading, setLoading] = useState(true);
    const [height, setHeight] = useState(100);

    useEffect(() => {
        if (path) {
            const img = new Image();

            img.onload = function () {
                setHeight(this.height);
            }

            img.src = path;
        }
    }, [path])

    return (
        <div style={{
            width: '70%',
            margin: 'auto'
        }}>
            {loading && <Skeleton height={`${height}px`} />}
            <img
                style={{
                    width: '100%',
                    display: 'block'
                }}
                src={path}
                onLoad={() => setLoading(false)}
            />
        </div>
    )
}

export default MyImage;