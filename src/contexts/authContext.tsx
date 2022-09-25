import { setCookie, parseCookies } from "nookies";
import LoginForm from "../components/form/loginForm";
import { User } from "../interfaces/objectInterfaces";
import { createContext, useState, useEffect } from "react";

interface AuthProviderProps {
    children?: any,
}

interface AuthContextData {
    token?: string,
    user?: User,
    isAuthenticaded?: boolean,
}

export const AuthContext = createContext({} as AuthContextData)

export default function AuthProvider(props: AuthProviderProps) {
    const [token, setToken] = useState<string>("")
    const [user, setUser] = useState<User | null>(null)
    const [isFirst, setIsFirst] = useState(true)
    const isAuthenticaded = !!user

    const handleSignIn = async (username, password) => {
        const res = await fetch("api/login", {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
        }).then((res) => res.json())
        if (res.isAuth === true) {
            setCookie(undefined, "mmjp.token", res.token, {
                maxAge: 60 * 60 * 12, //12 horas
            })
            setUser(res.data)
            return true
        }
        return false
    }

    useEffect(() => {
        if (isFirst) {
            if (!isAuthenticaded) {
                const { "mmjp.token": token } = parseCookies()
                fetch("api/checkLoginToken", {
                    method: "POST",
                    body: JSON.stringify({ token: token }),
                }).then(res => res.json()).then(res => {
                    setIsFirst(false)
                    if (res.isAuth) {
                        setToken(token)
                        setUser(res.data)
                    }
                })
            }
            {/*
window.onunload = (e) => {
    e.preventDefault();
    setCookie(undefined, "mmjp.token", "", {
        maxAge: 60 * 60 * 12, //12 horas
    })
}
*/}
        }
    })

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticaded
        }}>
            {isAuthenticaded ? (
                <>
                    {props.children}
                </>
            ) : (
                <LoginForm
                    onSignIn={handleSignIn}
                    isCheckingLogin={isFirst}
                />
            )}
        </AuthContext.Provider>
    )
}