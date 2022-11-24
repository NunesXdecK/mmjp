import LayoutMenu from "./layoutMenu";
import { useContext, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import Button from "../../components/button/button";
import { AuthContext } from "../../contexts/authContext";
import SwitchTextButton from "../button/switchTextButton";
import DropDownButton from "../../components/button/dropDownButton";
import FeedbackPendencyButton from "../button/feedbackPendencyButton";
import LayoutMenuMobile from "../../components/layout/layoutMenuMobile";
import { MenuIcon, MoonIcon, SunIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";

interface LayoutMenuProps {
    title?: string,
    children?: any[],
    check?: boolean,
    isLoading?: boolean,
    onSetPage?: (any) => void,
    onSetCheck?: (any) => void,
    onSetIsLoading?: (any) => void,
}

export interface LayoutMenuItem {
    name?: string,
    href?: string,
    value?: string,
    current?: boolean,
    disabled?: boolean,
    isLoading?: boolean,
    subMenus?: LayoutMenuItem[],
}

const menus: LayoutMenuItem[] = [
    { name: "Dashboard", href: "/", value: "DASHBOARD", current: false, disabled: false },
    {
        name: "Cadastros", current: false, disabled: false,
        subMenus:
            [
                { name: "Pessoas", href: "/person", value: "PERSON", current: false, disabled: false },
                { name: "Empresas", href: "/company", value: "COMPANY", current: false, disabled: false },
                { name: "Profissionais", href: "/professional", value: "PROFESSIONAL", current: false, disabled: false },
                { name: "Imóveis", href: "/immobile", value: "IMMOBILE", current: false, disabled: false },
                { name: "Usuários", href: "/user", value: "USER", current: false, disabled: false },

            ]
    },
    {
        name: "Financeiro", current: false, disabled: false,
        subMenus:
            [
                { name: "Orçamentos", href: "/budget", value: "BUDGET", current: false, disabled: false },
                { name: "Pagamentos", href: "/servicePayment", value: "PAYMENT", current: false, disabled: false },

            ]
    },
    {
        name: "Projetos", current: false, disabled: false,
        subMenus:
            [
                { name: "Projetos", href: "/project", value: "PROJECT", current: false, disabled: false },
                { name: "Serviços", href: "/service", value: "SERVICE", current: false, disabled: false },
                { name: "Etapas", href: "/serviceStage", value: "SERVICESTAGE", current: false, disabled: false },

            ]
    },
]

export default function Layout(props: LayoutMenuProps) {
    const { "mmjp.darktheme": token } = parseCookies()
    const [isDark, setIsDark] = useState(token && token === "true" ? true : false)
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useContext(AuthContext)

    const handleSetCheck = (value) => {
        if (props.onSetCheck) {
            props.onSetCheck(value)
        }
    }

    const handleDeleteClick = async () => {
        const { "mmjp.token": token } = parseCookies()
        const res = await fetch("api/loginToken", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: token }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            setCookie(undefined, "mmjp.token", "", {
                maxAge: 60 * 60 * 12, //12 horas
            })
            location.reload()
        }
    }
    const handleSetPage = (value) => {
        if (props.onSetPage) {
            props.onSetPage(value)
        }
    }

    let holderClassName = "min-h-screen"
    if (isDark) {
        holderClassName = holderClassName + " bg-gray-800 dark"
    } else {
        holderClassName = holderClassName + " bg-transparent"
    }

    return (
        <div className={holderClassName}>
            <div className="bg-gray-800 shadow pb-32 dark:shadow-none">
                <div className="hidden sm:block">
                    <div className="flex flex-row items-center justify-between px-2 py-4">
                        <div className="flex flex-row gap-2">
                            <LayoutMenu isDisabled={props.isLoading} menus={menus} onSetPage={handleSetPage} />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <FeedbackPendencyButton check={props.check} onSetCheck={handleSetCheck} isLoading={props.isLoading} />
                            <SwitchTextButton
                                className=""
                                isSwitched={!isDark}
                                isDisabled={props.isLoading}
                                buttonClassName="p-2 hover:bg-gray-600 rounded-full"
                                onChildren={(
                                    <SunIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                                )}
                                offChildren={(
                                    <MoonIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                                )}
                                onClick={() => {
                                    setCookie(undefined, "mmjp.darktheme", !isDark + "", {})
                                    setIsDark(!isDark)
                                }}
                            />
                            <DropDownButton
                                isLeft
                                id="user-drop-down"
                                isDisabled={props.isLoading}
                                className="p-2 bg-transparent hover:bg-gray-600 rounded-full"
                                title={(
                                    <UserCircleIcon className="text-gray-200 block h-8 w-8" aria-hidden="true" />
                                )}
                            >
                                <div className="flex flex-col gap-2 bg-gray-800 text-gray-300 disabled:opacity-75 rounded">
                                    <Button
                                        ignoreClass
                                        id="user-drop-down-profile"
                                        isDisabled={props.isLoading}
                                        onClick={() => handleSetPage("PROFILE")}
                                        className="px-4 py-2 text-sm text-left rounded bg-transparent hover:bg-gray-700 hover:text-white "
                                    >
                                        Perfil
                                    </Button>
                                    <Button
                                        ignoreClass
                                        id="user-drop-down-logoff"
                                        onClick={handleDeleteClick}
                                        isDisabled={props.isLoading}
                                        className="px-4 py-2 text-sm text-left rounded bg-transparent hover:bg-gray-700 hover:text-white "
                                    >
                                        Logoff
                                    </Button>
                                </div>
                            </DropDownButton>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white mx-auto py-6 px-4">{props.title}</p>
                </div>
                <div className="block sm:hidden">
                    <div className="flex flex-row items-center justify-between px-2 py-4">
                        <p className="pl-4 text-xl font-bold text-white">{props.title}</p>

                        <div className="flex flex-row gap-2 items-center">
                            <SwitchTextButton
                                className=""
                                isSwitched={isDark}
                                isDisabled={props.isLoading}
                                buttonClassName="p-2 hover:bg-gray-600 rounded-full"
                                onChildren={(
                                    <SunIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                                )}
                                offChildren={(
                                    <MoonIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                                )}
                                onClick={() => {
                                    setCookie(undefined, "mmjp.darktheme", !isDark + "", {})
                                    setIsDark(!isDark)
                                }}
                            />
                            <Button
                                ignoreClass
                                isDisabled={props.isLoading}
                                onClick={() => setIsOpen(!isOpen)}
                                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            >
                                <span className="sr-only">Abrir menu</span>
                                {isOpen ? (
                                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="px-2">
                            <LayoutMenuMobile isDisabled={props.isLoading} menus={menus} onSetPage={handleSetPage} onSetIsOpen={setIsOpen} />
                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <UserCircleIcon className="block text-gray-300 h-10 w-10" aria-hidden="true" />
                                    <span className="ml-2 text-md font-medium leading-none text-gray-300">{user.username}</span>
                                </div>
                                <Button
                                    isLight
                                    onClick={handleDeleteClick}
                                    isDisabled={props.isLoading}
                                    className="bg-transparent hover:bg-transparent hover:opacity-70"
                                >
                                    <span className="float-left text-sm text-gray-300">Logoff</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="-mt-32 p-6 z-10">
                <div className="p-4 rounded shadow dark:border dark:border-gray-700 dark:shadow-none bg-slate-50 dark:bg-slate-800 z-10">
                    {props.children}
                </div>
            </div>
        </div>
    )
}