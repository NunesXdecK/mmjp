import { LayoutMenuItem } from "./layout"
import { Disclosure, Transition } from "@headlessui/react"


interface LayoutMenuMobileProps {
    menus?: LayoutMenuItem[],
}

export default function LayoutMenuMobile(props: LayoutMenuMobileProps) {

    const aClassName = "w-full block px-2 py-6 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
    return (
        <>
            {props.menus.map((element, index) => (
                <div key={index + element.name}>
                    {element.subMenus ?
                        (
                            <>
                                <Disclosure
                                    as="div"
                                    className={aClassName}
                                    key={index + element.name}>
                                    <Disclosure.Button
                                        className="w-full text-left">
                                        {element.name}
                                    </Disclosure.Button>

                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0">
                                        <Disclosure.Panel
                                            className={`
                                                mt-2
                                                w-full 
                                                origin-top-left
                                                bg-gray-800 rounded-md 
                                                focus:outline-none`}>
                                            {element.subMenus.map((elementItem, index) => (
                                                <a
                                                    key={index + elementItem.name}
                                                    className={aClassName}
                                                    href={elementItem.href}
                                                >
                                                    {elementItem.name}
                                                </a>
                                            ))}
                                        </Disclosure.Panel>
                                    </Transition>
                                </Disclosure>
                            </>
                        ) : (
                            <>
                                <a
                                    key={index + element.name}
                                    className={aClassName}
                                    href={element.href}
                                >
                                    {element.name}
                                </a>
                            </>
                        )
                    }
                </div>
            ))}
        </>
    )
}