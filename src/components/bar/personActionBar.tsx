import ActionBar from "./actionBar";
import Button from "../button/button";
import { handleCheckClientCode } from "../inputText/inputClientCode";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handlePersonValidationForDB } from "../../util/validationUtil";
import { Person, defaultPerson } from "../../interfaces/objectInterfaces";
import { handleRemoveCEPMask, handleRemoveCPFMask, handleRemoveTelephoneMask } from "../../util/maskUtil";

interface PersonActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    person?: Person,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handlePersonForDB = (person: Person) => {
    if (person.address && person.address?.cep) {
        person = { ...person, address: { ...person.address, cep: handleRemoveCEPMask(person.address.cep) } }
    }
    let telephonesWithNoMask = []
    if (person.telephones && person.telephones.length) {
        person.telephones?.map((element, index) => {
            telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
        })
    }
    person = {
        ...person,
        name: person.name.trim(),
        telephones: telephonesWithNoMask,
        cpf: handleRemoveCPFMask(person.cpf),
    }
    return person
}

export const handleSavePersonInner = async (person, history) => {
    let res = { status: "ERROR", id: "", person: person }
    person = handlePersonForDB(person)
    try {
        const saveRes = await fetch("api/person", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: person, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, person: { ...person, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function PersonActionBarForm(props: PersonActionBarFormProps) {
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

    const handlePersonValidationForDBInner = (person, isSearching) => {
        let isValid = handlePersonValidationForDB(person)
        if (person.clientCode.length > 0) {
            if (isSearching) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O codigo do cliente já está em uso."]
                }
            }
        }
        return isValid
    }

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let person = props.person
        let resCC = await handleCheckClientCode(person.clientCode, person.id)
        const isValid = handlePersonValidationForDBInner(person, resCC.data)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSavePersonInner(person, true)
        person = { ...person, id: res.id }
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
            props.onSet(defaultPerson)
        } else if (isForCloseModal) {
            props.onSet(person)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, person, isForCloseModal)
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
