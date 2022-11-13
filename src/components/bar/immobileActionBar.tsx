import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleImmobileValidationForDB } from "../../util/validationUtil";
import { Immobile, defaultImmobile } from "../../interfaces/objectInterfaces";
import { handleRemoveCEPMask } from "../../util/maskUtil";

interface ImmobileActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    immobile?: Immobile,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleImmobileForDB = (immobile: Immobile) => {
    let owners = []
    if (immobile?.owners?.length > 0) {
        immobile.owners?.map((element, index) => {
            if (element.id?.length > 0) {
                if ("cpf" in element) {
                    owners = [...owners, { id: element.id, cpf: "" }]
                } else if ("cnpj" in element) {
                    owners = [...owners, { id: element.id, cnpj: "" }]
                }
            }
        })
    }
    immobile = {
        ...immobile,
        owners: owners,
        name: immobile.name.trim(),
        land: immobile.land.trim(),
        county: immobile.county.trim(),
        address: { ...immobile.address, cep: handleRemoveCEPMask(immobile.address?.cep) }
    }
    return immobile
}

export const handleSaveImmobileInner = async (immobile, history) => {
    let res = { status: "ERROR", id: "", immobile: immobile }
    immobile = handleImmobileForDB(immobile)
    try {
        const saveRes = await fetch("api/immobile", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: immobile, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, immobile: { ...immobile, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function ImmobileActionBarForm(props: ImmobileActionBarFormProps) {
    const handleSetIsLoading = (value: boolean) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let immobile = props.immobile
        const isValid = handleImmobileValidationForDB(immobile)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveImmobileInner(immobile, true)
        immobile = { ...immobile, id: res.id }
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        handleSetIsLoading(false)
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (props.isMultiple && props.onSet) {
            props.onSet(defaultImmobile)
        } else if (isForCloseModal) {
            props.onSet(immobile)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, immobile, isForCloseModal)
        }
    }

    return (
        <ActionBar className={props.className + " bg-slate-50 dark:bg-slate-800 dark:border dark:border-gray-700"}>
            <div className="w-full flex flex-row justify-between">
                <Button
                    isLoading={props.isLoading}
                    onClick={() => handleSave(false)}
                >
                    Salvar
                </Button>
            </div>
        </ActionBar>
    )
}
