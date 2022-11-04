import Button from "../button/button"
import { LayoutMenuItem } from "./layout"
import DropDownButton from "../button/dropDownButton"

interface LayoutMenuProps {
    menus?: LayoutMenuItem[],
    onSetPage?: (any) => void,
}

export default function LayoutMenu(props: LayoutMenuProps) {
    const aClassName = "block w-full text-left rounded px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-75"
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
                        (<>
                            <DropDownButton
                                id={element.name}
                                title={element.name}
                                className={aClassName}
                            >
                                <div
                                    className={"p-2 w-max left-0 absolute bg-gray-800 rounded-md focus:outline-none"}>
                                    {element.subMenus.map((elementItem, index) => (
                                        <Button
                                            ignoreClass
                                            className={aClassName}
                                            key={index + elementItem.name}
                                            isDisabled={elementItem.disabled}
                                            id={element.name + "-" + elementItem.name + "-" + index}
                                            onClick={() => handleSetPage(elementItem.value)}
                                        >
                                            {elementItem.name}
                                        </Button>
                                    ))}
                                </div>
                            </DropDownButton>
                        </>) : (<>
                            <Button
                                ignoreClass
                                id={element.name}
                                className={aClassName}
                                onClick={() => handleSetPage(element.value)}
                            >
                                {element.name}
                            </Button>
                        </>)}
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