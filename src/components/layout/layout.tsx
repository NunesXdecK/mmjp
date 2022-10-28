import { Fragment, useContext } from "react"
import LayoutMenu from "./layoutMenu"
import Button from "../button/button"
import LayoutMenuMobile from "./layoutMenuMobile"
import { setCookie, parseCookies } from "nookies";
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline"
import { UserCircleIcon } from "@heroicons/react/solid";
import { AuthContext } from "../../contexts/authContext";
import { defaultUser } from "../../interfaces/objectInterfaces";
import FeedbackPendency from "../modal/feedbackPendencyModal";

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

{/*
    { name: "Pessoas da base antiga", href: "/person/personoldbase", current: false, disabled: true },
    { name: "Imóvel da base antiga", href: "/immobile/immobileoldbase", current: false, disabled: true },
*/}
{/*
const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
}
*/}

const navigation = [
    { name: "Dashboard", href: "/", current: false },
    { name: "Pessoas", href: "/person", current: false },
    { name: "Imóveis", href: "/immobile", current: false },
    { name: "Projetos", href: "/project", current: false },
]

const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

interface LayoutMenuProps { }

export default function Layout(props) {
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

    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
            <div className="min-h-full">
                <div className="hidden">
                    <span className="animate-pulse">hidden</span>
                </div>
                <div className="bg-gray-800 print:hidden sm:flex sm:flex-row sm:justify-between">
                    <Disclosure as="nav" >
                        {({ open }) => (
                            <>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-between h-16">
                                        <div className="flex items-center">

                                            <div className="flex-shrink-0">
                                                {/*
                                            <img
                                                className="h-8 w-8"
                                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                                                alt="Workflow"
                                            />
                                             */}
                                                <h1 className="text-xl font-bold text-white block sm:hidden">{props.title}</h1>
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="ml-10 flex items-baseline space-x-4">
                                                    <LayoutMenu menus={menus} />

                                                    {/*
                                                {navigation.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-gray-900 text-white"
                                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                            "px-3 py-2 rounded-md text-sm font-medium"
                                                        )}
                                                        aria-current={item.current ? "page" : undefined}
                                                    >
                                                        {item.name}
                                                    </a>
                                                ))}
                                            */}
                                                </div>
                                            </div>
                                        </div>
                                        {/*
                                        <div className="hidden md:block">
                                            <div className="ml-4 flex items-center md:ml-6">
                                                <button
                                                    type="button"
                                                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                                >
                                                    <span className="sr-only">View notifications</span>
                                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>

                                                Profile dropdown
                                                <Menu as="div" className="ml-3 relative">
                                                    <div>
                                                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                            <span className="sr-only">Open user menu</span>
                                                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            {userNavigation.map((item) => (
                                                                <Menu.Item key={item.name}>
                                                                    {({ active }) => (
                                                                        <a
                                                                            href={item.href}
                                                                            className={classNames(
                                                                                active ? "bg-gray-100" : "",
                                                                                "block px-4 py-2 text-sm text-gray-700"
                                                                            )}
                                                                        >
                                                                            {item.name}
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            ))}
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>
                                        </div>
*/}
                                        <div className="-mr-2 flex md:hidden">
                                            {/* Mobile menu button */}
                                            <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Abrir menu</span>
                                                {open ? (
                                                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                                                ) : (
                                                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                                )}
                                            </Disclosure.Button>
                                        </div>

                                    </div>
                                </div>
                                <Disclosure.Panel className="md:hidden">
                                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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

                                    {/*

                                    <div className="pt-4 pb-3 border-t border-gray-700">
                                        <div className="flex items-center px-5">
                                            <div className="flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                                <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                            </div>

                                            <button
                                                type="button"
                                                className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                            >
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="mt-3 px-2 space-y-1">
                                            {userNavigation.map((item) => (
                                                <Disclosure.Button
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                                >
                                                    {item.name}
                                                </Disclosure.Button>
                                            ))}
                                        </div>
                                    </div>
                            */}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>

                    <div className="p-3 hidden md:block">
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                {/*
                                Profile dropdown
                               */}
                                <Menu as="div" className="ml-3 relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-300">
                                            <UserCircleIcon className="block text-gray-300 h-8 w-8" aria-hidden="true" />
                                            {/*
                                            <span className="sr-only">Open user menu</span>
                                            <img className="h-8 w-8 rounded-full" src="../../images/avatarplaceholder.png" alt="" />
                                            */}
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="text-left origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {/*
                                            <Menu.Item>
                                                <Button
                                                    isLink
                                                    isLight
                                                    className="block w-full rounded-none px-4 py-2 text-sm text-left hover:bg-transparent"
                                                >
                                                    <span className="float-left text-sm text-gray-700">Perfil</span>
                                                </Button>
                                            </Menu.Item>
                                            */}
                                            <Menu.Item>
                                                <Button
                                                    isLight
                                                    onClick={handleDeleteClick}
                                                    className="block w-full rounded-none px-4 py-2 text-sm text-left hover:bg-transparent"
                                                >
                                                    <span className="float-left text-sm text-gray-700">Logoff</span>
                                                </Button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>

                <header className="bg-gray-800">
                    <div className="max-w-7xl mx-auto py-6 px-4 pb-32 sm:pb-40 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white hidden sm:block">{props.title}</h1>
                    </div>
                </header>

                <main>
                    <div className="max-w-7xl -mt-36 mx-auto py-6 px-6 lg:px-8 print:px-0 print:py-0">
                        {/* Replace with your content */}
                        <div className="bg-slate-50 shadow-md rounded-lg sm:px-0 z-50 print:shadow-none print:px-0 print:py-0">
                            {props.children}
                            {/*
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                            </div>
                            */}
                        </div>
                        {/* /End replace */}
                    </div>
                </main>

                {/* 
                <footer className="bg-gray-800">
                    <div className="max-w-7xl mx-auto py-6 px-4 pt-40 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">Footer bonito</h1>
                    </div>
                </footer>
                    */}

            </div>
        </>
    )
}