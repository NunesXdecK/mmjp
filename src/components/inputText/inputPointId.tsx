import { useState } from "react"
import InputText from "./inputText"
import { NOT_NULL_MARK } from "../../util/patternValidationUtil"

interface InputPointIdProps {
    id?: string,
    title?: string,
    value?: string,
    holderClassName?: string,
    elementId?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    onBlur?: (any?) => void,
    onSet?: (value) => void,
}

export const handleCheckPointId = async (code, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isPointIdAvaliable/" + code + "/" + (id ?? 0)).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export default function InputPointId(props: InputPointIdProps) {
    const [isPointIdInvalid, setIsPointIdInvalid] = useState(false)
    const [isCheckingPointId, setIsCheckingPointId] = useState(false)

    const handleValidPointId = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (props.value?.length > 0) {
            if (!show) {
                setIsCheckingPointId(true)
            }
            let res = await handleCheckPointId(props.value, props.elementId)
            if (!show) {
                setIsCheckingPointId(false)
            }
            setIsPointIdInvalid(res.data)
            return res.data
        } else {
            setIsPointIdInvalid(false)
            return false
        }
    }

    return (
        <InputText
            value={props.value}
            onSetText={props.onSet}
            validation={NOT_NULL_MARK}
            isLoading={props.isLoading}
            isInvalid={isPointIdInvalid}
            isDisabled={props.isDisabled}
            id={props.id + "-input-point-id"}
            message="Verificando o PointId..."
            title={props.title ?? "ID do ponto"}
            isForShowMessage={isCheckingPointId}
            validationMessage="O ID não pode ficar em branco, ou já está em uso."
            onBlur={(event) => {
                handleValidPointId(event)
                if (props.onBlur) {
                    props.onBlur(event)
                }
            }}
        />
    )
}

