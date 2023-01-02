import { useState } from "react"
import InputText from "./inputText"
import { handleRemoveCPFMask } from "../../util/maskUtil"
import { CPF_MARK } from "../../util/patternValidationUtil"

interface InputCPFProps {
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

export const handleCheckCPF = async (code, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isCPFAvaliable/" + handleRemoveCPFMask(code) + "/" + (id ?? 0)).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export default function InputCPF(props: InputCPFProps) {
    const [isCPFInvalid, setIsCPFInvalid] = useState(false)
    const [isCheckingCPF, setIsCheckingCPF] = useState(false)

    const handleValidCPF = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (props.value?.length > 0) {
            if (!show) {
                setIsCheckingCPF(true)
            }

            let res = await handleCheckCPF(props.value, props.elementId)
            if (!show) {
                setIsCheckingCPF(false)
            }
            setIsCPFInvalid(res.data)
            return res.data
        } else {
            setIsCPFInvalid(false)
            return false
        }
    }

    return (
        <InputText
            mask="cpf"
            maxLength={14}
            value={props.value}
            validation={CPF_MARK}
            onSetText={props.onSet}
            isInvalid={isCPFInvalid}
            isLoading={props.isLoading}
            title={props.title ?? "CPF"}
            id={props.id + "-input-cpf"}
            isDisabled={props.isDisabled}
            message="Verificando o CPF..."
            isForShowMessage={isCheckingCPF}
            validationMessage="O CPF já está em uso."
            onBlur={(event) => {
                handleValidCPF(event)
                if (props.onBlur) {
                    props.onBlur(event)
                }
            }}
        />
    )
}

