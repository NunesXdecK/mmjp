import Button from "../button/button"
import { LayoutMenuItem } from "./layout"
import DropDownButton from "../button/dropDownButton"


interface LayoutMenuMobileProps {
    menus?: LayoutMenuItem[],
}

export default function LayoutMenuMobile(props: LayoutMenuMobileProps) {

    const aClassName = "text-left w-full block px-2 py-6 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
    return (
        <>
            {props.menus.map((element, index) => (
                <div key={index + element.name}>
                    {element.subMenus ?
                        (
                            <>
                                <DropDownButton
                                    isNotFloat
                                    title={element.name}
                                    className={aClassName}
                                    key={index + element.name}
                                >
                                    <div
                                        className={"mt-2 w-full origin-top-left bg-gray-800 focus:outline-none"}>
                                        {element.subMenus.map((elementItem, index) => (
                                            <Button
                                                isLink
                                                ignoreClass
                                                className={aClassName}
                                                href={elementItem.href}
                                                key={index + elementItem.name}
                                            >
                                                {elementItem.name}
                                            </Button>
                                        ))}
                                    </div>
                                </DropDownButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    isLink
                                    ignoreClass
                                    href={element.href}
                                    className={aClassName}
                                    key={index + element.name}
                                >
                                    {element.name}
                                </Button>
                            </>
                        )
                    }
                </div>
            ))}
        </>
    )
}