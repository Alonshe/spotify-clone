import React, {useEffect, useState} from 'react';
import axios from "axios";

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    //Login
    useEffect(() => {
        axios.post('http://localhost:3005/login', {
            code,
        })
            .then(res => {
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                window.history.pushState({}, null, '/')
            })
             .catch(() => {
                window.location = '/'
            })
    }, [code])


    //Refresh Token
    useEffect(() => {
        if(!refreshToken || !expiresIn) return
        const interval= setInterval( () => {

        axios.post('http://localhost:3005/refresh', {
            refreshToken,
        })
            .then(res => {
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
                window.history.pushState({}, null, '/')
            })
            .catch((err) => {
                console.log(err)
                window.location = '/'
            })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    },[refreshToken,expiresIn])

    return accessToken
}

