import { useEffect, useState } from "react"
import Button from "../button/button"
import WindowModal from "../modal/windowModal"

const subtitle = "mt-1 max-w-2xl text-sm text-gray-500"

interface ActionButtonsFormProps {
    centerText?: string,
    leftWindowText?: string,
    leftButtonText?: string,
    rightWindowText?: string,
    rightButtonText?: string,
    isLeftOn?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isForOpenLeft?: boolean,
    isForOpenRight?: boolean,
    isForBackControl?: boolean,
    onLeftClick?: (any?) => void,
    onRightClick?: (any?) => void,
}


export default function ActionButtonsForm(props: ActionButtonsFormProps) {
    const navigationBarClassName = "bg-white px-4 py-3 border-t border-gray-200 sm:px-6"
    let buttonHolderClassName = "p-2 flex"

    if (props.isLeftOn && props.onLeftClick) {
        buttonHolderClassName = buttonHolderClassName + " justify-between"
    } else {
        buttonHolderClassName = buttonHolderClassName + " justify-end"
    }

    const [isOpenLeft, setIsOpenLeft] = useState(false)
    const [isOpenRight, setIsOpenRight] = useState(false)

    useEffect(() => {
        if (props.isForBackControl) {
            if (props.onLeftClick) {
                if (props.isForOpenLeft) {
                    window.onbeforeunload = () => {
                        return false
                    }
                }
                {/*
                    document.addEventListener("keydown", (event) => {
                        if (event.keyCode === 116) {
                            event.preventDefault()
                            setIsOpenLeft(true)
                        }
                    })
                 } else {
                        window.onbeforeunload = () => { }
                        document.addEventListener("keydown", (event) => { })
                    }
                */}

                {/*
                window.onpopstate = (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    props.onLeftClick()
                }
            */}
            }
        }
    })

    return (
        <div>
            <div className={navigationBarClassName}>
                <div className={buttonHolderClassName}>
                    {props.isLeftOn && props.onLeftClick && (
                        <Button
                            type="button"
                            onClick={(event) => {
                                if (props.isForOpenLeft) {
                                    setIsOpenLeft(true)
                                } else {
                                    if (props.onLeftClick) {
                                        props.onLeftClick(event)
                                    }
                                    setIsOpenLeft(false)
                                }
                            }}
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                        >
                            {props.leftButtonText ?? "Voltar"}
                        </Button>
                    )}

                    {props.centerText && (
                        <span className={subtitle}>{props.centerText}</span>
                    )}

                    {props.onRightClick && (
                        <Button
                            onClick={(event) => {
                                if (props.isForOpenRight) {
                                    setIsOpenRight(true)
                                } else {
                                    if (props.onRightClick) {
                                        props.onRightClick(event)
                                    }
                                }
                            }}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled || props.isLoading}
                        >
                            {props.rightButtonText ?? "Salvar"}
                        </Button>
                    )}
                </div>
            </div>

            <WindowModal
                isOpen={isOpenLeft}
                setIsOpen={setIsOpenLeft}>
                <p className="text-center">{props.leftWindowText}</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenLeft(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={(event) => {
                            setIsOpenLeft(false)
                            if (props.onLeftClick) {
                                props.onLeftClick(event)
                            }
                        }}
                    >
                        Sair
                    </Button>
                </div>
            </WindowModal>

            <WindowModal
                isOpen={isOpenRight}
                setIsOpen={setIsOpenRight}>
                <p className="text-center">{props.rightWindowText}</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpenRight(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={(event) => {
                            setIsOpenRight(false)
                            if (props.onRightClick) {
                                props.onRightClick(event)
                            }
                        }}
                    >
                        {props.rightButtonText ?? "Editar"}
                    </Button>
                </div>
            </WindowModal>
        </div >
    )
}
