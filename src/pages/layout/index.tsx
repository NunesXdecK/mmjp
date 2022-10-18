import { MoonIcon, SunIcon, UserCircleIcon } from "@heroicons/react/solid";

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

export default function Layout() {

    return (
        <div className="">
            <div className="bg-gray-800 shadow">
                <div className="flex flex-row items-center justify-between px-2 py-4">
                    <div className="flex flex-row gap-2">
                        <span className="text-gray-200">Dashboard</span>
                        <span className="text-gray-200">Cadastro</span>
                        <span className="text-gray-200">Orçamento</span>
                        <span className="text-gray-200">Projeto</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <SunIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                        <MoonIcon className="text-gray-200 block h-5 w-5" aria-hidden="true" />
                        <UserCircleIcon className="text-gray-200 block h-8 w-8" aria-hidden="true" />
                    </div>
                </div>

                <p className="text-gray-200 p-6 pb-40">Titulo</p>
            </div>
            <div className="bg-transparent -mt-36 p-6 z-10">
                <div className="bg-orange-200 pt-10 pb-10 z-10">
                    <p className="text-gray-800">conteúdo</p>
                </div>
            </div>
        </div>
    )
}
