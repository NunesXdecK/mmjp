import LayoutMenu from "./layoutMenu";
import { useContext, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import Button from "../../components/button/button";
import { AuthContext } from "../../contexts/authContext";
import BudgetView from "../../components/view/budgetView";
import DropDownButton from "../../components/button/dropDownButton";
import LayoutMenuMobile from "../../components/layout/layoutMenuMobile";
import { MenuIcon, MoonIcon, SunIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import SwitchTextButton from "../button/switchTextButton";

interface LayoutMenuProps {
    title?: string,
}

export interface LayoutMenuItem {
    name?: string,
    href?: string,
    current?: boolean,
    disabled?: boolean,
    subMenus?: LayoutMenuItem[],
}

const menus: LayoutMenuItem[] = [
    { name: "Testes", href: "/", current: false, disabled: false },
    {
        name: "Cadastros", current: false, disabled: false,
        subMenus:
            [
                { name: "Pessoas", href: "/person", current: false, disabled: false },
                { name: "Empresas", href: "/company", current: false, disabled: false },
                { name: "Profissionais", href: "/professional", current: false, disabled: false },
                { name: "Imóveis", href: "/immobile", current: false, disabled: false },
                { name: "Usuários", href: "/user", current: false, disabled: false },

            ]
    },
    {
        name: "Orçamentos", href: "/budget", current: false, disabled: false,
    },
    {
        name: "Projetos", current: false, disabled: false,
        subMenus:
            [
                { name: "Projetos", href: "/project", current: false, disabled: false },
                { name: "Serviços", href: "/service", current: false, disabled: false },
                { name: "Etapas", href: "/serviceStage", current: false, disabled: false },
                { name: "Pagamentos", href: "/servicePayment", current: false, disabled: false },

            ]
    },
]

export default function Layout(props) {
    const { "mmjp.darktheme": token } = parseCookies()
    const [isDark, setIsDark] = useState(token && token === "true" ? true : false)
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useContext(AuthContext)

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

    let holderClassName = "min-h-screen"
    if (!isDark) {
        holderClassName = holderClassName + " bg-gray-800 dark"
    } else {
        holderClassName = holderClassName + " bg-transparent"
    }

    return (
        <div className={holderClassName}>
            <div className="bg-gray-800 shadow pb-32">
                <div className="hidden sm:block">
                    <div className="flex flex-row items-center justify-between px-2 py-4">
                        <div className="flex flex-row gap-2">
                            <LayoutMenu menus={menus} />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <SwitchTextButton
                                className=""
                                isSwitched={isDark}
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
                                className="p-2 bg-transparent hover:bg-gray-600 rounded-full"
                                title={(
                                    <UserCircleIcon className="text-gray-200 block h-8 w-8" aria-hidden="true" />
                                )}
                            >
                                <Button
                                    ignoreClass
                                    onClick={handleDeleteClick}
                                    className="px-4 py-2 text-sm text-left rounded bg-transparent hover:bg-gray-400 hover:opacity-70"
                                >
                                    Logoff
                                </Button>
                            </DropDownButton>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white mx-auto py-6 px-4">{props.title}</p>
                </div>
                <div className="block sm:hidden">
                    <div className="flex flex-row items-center justify-between px-2 py-4">
                        <p className="pl-4 text-xl font-bold text-white">{props.title}</p>

                        <div>
                            <Button
                                ignoreClass
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
                            <LayoutMenuMobile menus={menus} />

                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    <UserCircleIcon className="block text-gray-300 h-10 w-10" aria-hidden="true" />
                                    <span className="ml-2 text-md font-medium leading-none text-gray-300">{user.username}</span>
                                </div>
                                <Button
                                    isLight
                                    onClick={handleDeleteClick}
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
                <div className="rounded shadow bg-slate-50 dark:bg-slate-800 z-10">
                    {props.children}
                </div>
            </div>
        </div>
    )
}