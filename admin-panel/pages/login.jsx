import { useEffect } from "react";
import Link from 'next/link';

function Login() {
    const uri = encodeURIComponent(process.env.NEXT_PUBLIC_SELF_URL);

    return (
        <>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/oauth/vk?redirect_uri=${uri}`}>login</Link>
        </>
    )
}

export default Login;