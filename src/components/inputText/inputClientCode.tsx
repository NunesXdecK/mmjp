import { useState } from "react"
import InputText from "./inputText"

interface InputClientCodeProps {
    id?: string,
    title?: string,
    value?: string,
    elementId?: string,
    holderClassName?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any?) => void,
    onSet?: (value) => void,
}

export const handleCheckClientCode = async (code, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isClientCodeAvaliable/" + code + "/" + id).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export default function InputClientCode(props: InputClientCodeProps) {
    const [isClientCodeInvalid, setIsClientCodeInvalid] = useState(false)
    const [isCheckingClientCode, setIsCheckingClientCode] = useState(false)

    const handleValidClientCode = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (props.value?.length > 0) {
            if (!show) {
                setIsCheckingClientCode(true)
            }
            let res = await handleCheckClientCode(props.value, props.elementId)
            if (!show) {
                setIsCheckingClientCode(false)
            }
            setIsClientCodeInvalid(res.data)
            return res.data
        } else {
            setIsClientCodeInvalid(false)
            return false
        }
    }

    return (
        <InputText
            value={props.value}
            title={props.title}
            onSetText={props.onSet}
            isLoading={props.isLoading}
            id={props.id + "-input-code"}
            isDisabled={props.isDisabled}
            isInvalid={isClientCodeInvalid}
            message="Verificando o codigo..."
            isForShowMessage={isCheckingClientCode}
            validationMessage="O código já está em uso."
            onBlur={(event) => {
                handleValidClientCode(event)
                if (props.onBlur) {
                    props.onBlur(event)
                }
            }}
        />
    )
}

