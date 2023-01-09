import { useState } from "react"
import InputText from "./inputText"
import { CNPJ_MARK } from "../../util/patternValidationUtil"
import { handleRemoveCNPJMask } from "../../util/maskUtil"

interface InputCNPJProps {
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

export const handleCheckCNPJ = async (code, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isCNPJAvaliable/" + handleRemoveCNPJMask(code) + "/" + (id ?? 0)).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export default function InputCNPJ(props: InputCNPJProps) {
    const [isCNPJInvalid, setIsCNPJInvalid] = useState(false)
    const [isCheckingCNPJ, setIsCheckingCNPJ] = useState(false)

    const handleValidCNPJ = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (props.value?.length > 0) {
            if (!show) {
                setIsCheckingCNPJ(true)
            }
            let res = await handleCheckCNPJ(props.value, props.elementId)
            if (!show) {
                setIsCheckingCNPJ(false)
            }
            setIsCNPJInvalid(res.data)
            return res.data
        } else {
            setIsCNPJInvalid(false)
            return false
        }
    }

    return (
        <InputText
            mask="cnpj"
            maxLength={18}
            value={props.value}
            validation={CNPJ_MARK}
            onSetText={props.onSet}
            isInvalid={isCNPJInvalid}
            isLoading={props.isLoading}
            title={props.title ?? "CNPJ"}
            id={props.id + "-input-cnpj"}
            isDisabled={props.isDisabled}
            message="Verificando o CNPJ..."
            isForShowMessage={isCheckingCNPJ}
            validationMessage="O CNPJ já está em uso."
            onBlur={(event) => {
                handleValidCNPJ(event)
                if (props.onBlur) {
                    props.onBlur(event)
                }
            }}
        />
    )
}

