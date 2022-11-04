import Button from "../button/button"
import { LayoutMenuItem } from "./layout"
import DropDownButton from "../button/dropDownButton"

interface LayoutMenuMobileProps {
    menus?: LayoutMenuItem[],
    onSetPage?: (any) => void,
}

export default function LayoutMenuMobile(props: LayoutMenuMobileProps) {
    const aClassName = "text-left w-full rounded block px-2 py-6 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
    const handleSetPage = (value) => {
        if (props.onSetPage) {
            props.onSetPage(value)
        }
    }
    return (
        <>
            {props.menus.map((element, index) => (
                <div key={index + element.name}>
                    {element.subMenus ?
                        (
                            <>
                                <DropDownButton
                                    isNotFloat
                                    id={element.name}
                                    title={element.name}
                                    className={aClassName}
                                    key={index + element.name}
                                >
                                    <div
                                        className={"mt-2 w-full origin-top-left bg-gray-800 focus:outline-none"}>
                                        {element.subMenus.map((elementItem, index) => (
                                            <Button
                                                ignoreClass
                                                className={aClassName}
                                                key={index + elementItem.name}
                                                id={element.name + "-" + elementItem.name + "-" + index}
                                                onClick={() => handleSetPage(element.value)}
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
                                    ignoreClass
                                    id={element.name}
                                    className={aClassName}
                                    key={index + element.name}
                                    onClick={() => handleSetPage(element.value)}
                                >
                                    {element.name}
                                </Button>
                            </>
                        )
                    }
                </div>
            ))}
            {/*
            isLink
            href={element.href}
        isLink
        href={elementItem.href}
    */}
        </>
    )
}