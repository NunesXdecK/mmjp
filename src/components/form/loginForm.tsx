import { useState } from "react";
import InputText from "../inputText/inputText";
import { LockClosedIcon } from "@heroicons/react/solid";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../modal/feedbackMessageModal";
import Button from "../button/button";
import Head from "next/head";

interface ImmobileFormProps {
    isCheckingLogin?: boolean,
    onSignIn?: (login, password) => Promise<boolean>,
}

export default function LoginForm(props: ImmobileFormProps) {
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    return (
        <>

            <Head>
                <title>Login</title>
                <meta name="description" content="Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
    */}
            <div className="hidden">
                <span className="animate-pulse">hidden</span>
            </div>

            {props.isCheckingLogin && (
                <div className="h-full flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                Verificando se há login
                            </h2>
                        </div>
                    </div>
                </div>

            )}
            {!props.isCheckingLogin && (
                <div className="h-full flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                                Faça o login da sua conta
                            </h2>
                        </div>
                        <form
                            onSubmit={async (event) => {
                                event.preventDefault()
                                if (props.onSignIn) {
                                    setIsLoading(true)
                                    let res = await props.onSignIn(username, password)
                                    setIsLoading(false)
                                    let message = "Houve algum problema com o seu login"
                                    handleShowMessage({ ...feedbackMessage, messages: [message], messageType: "ERROR" })
                                }
                            }}
                            className="mt-8 space-y-6">
                            <input type="hidden" name="remember" defaultValue="true" />
                            <div className="-space-y-px rounded-md shadow-sm">
                                <InputText
                                    id="username"
                                    value={username}
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    onSetText={setUsername}
                                    classNameLabel="sr-only"
                                    placeholder="Nome de usuário"
                                    validation={NOT_NULL_MARK}
                                    classNameInput="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                                <InputText
                                    id="password"
                                    type="password"
                                    value={password}
                                    placeholder="Senha"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    onSetText={setPassword}
                                    classNameLabel="sr-only"
                                    validation={NOT_NULL_MARK}
                                    classNameInput="mt-0 relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/*
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Me lembre
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Esqueceu a sua senha?
                                </a>
                            </div>
                        </div>
                    */}

                            <div>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    isDisabled={isLoading}
                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                    </span>
                                    Entrar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                setIsOpen={setIsFeedbackOpen}
                feedbackMessage={feedbackMessage}
            />
        </>
    )
}