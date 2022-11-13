import ActionBar from "./actionBar";
import Button from "../button/button";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleCheckClientCode } from "../inputText/inputClientCode";
import { handleCompanyValidationForDB } from "../../util/validationUtil";
import { Company, defaultCompany } from "../../interfaces/objectInterfaces";
import { handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveTelephoneMask } from "../../util/maskUtil";

interface CompanyActionBarFormProps {
    className?: string,
    isLoading?: boolean,
    isMultiple?: boolean,
    isDisabled?: boolean,
    company?: Company,
    onSet?: (any) => void,
    onSetIsLoading?: (boolean) => void,
    onAfterSave?: (object, any?, boolean?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export const handleCompanyForDB = (company: Company) => {
    if (company.address && company.address?.cep) {
        company = { ...company, address: { ...company.address, cep: handleRemoveCEPMask(company.address.cep) } }
    }
    let telephonesWithNoMask = []
    if (company.telephones && company.telephones.length) {
        company.telephones?.map((element, index) => {
            telephonesWithNoMask = [...telephonesWithNoMask, handleRemoveTelephoneMask(element)]
        })
    }
    company = {
        ...company,
        name: company.name.trim(),
        telephones: telephonesWithNoMask,
        cnpj: handleRemoveCNPJMask(company.cnpj),
    }
    return company
}

export const handleSaveCompanyInner = async (company, history) => {
    let res = { status: "ERROR", id: "", company: company }
    company = handleCompanyForDB(company)
    try {
        const saveRes = await fetch("api/company", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: company, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: "SUCCESS", id: saveRes.id, company: { ...company, id: saveRes.id } }
    } catch (e) {
        console.error("Error adding document: ", e)
    }
    return res
}

export default function CompanyActionBarForm(props: CompanyActionBarFormProps) {
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

    const handleCompanyValidationForDBInner = (company, isSearching) => {
        let isValid = handleCompanyValidationForDB(company)
        if (company.clientCode.length > 0) {
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
        let company = props.company
        let resCC = await handleCheckClientCode(company.clientCode, company.id)
        const isValid = handleCompanyValidationForDBInner(company, resCC.data)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveCompanyInner(company, true)
        company = { ...company, id: res.id }
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
            props.onSet(defaultCompany)
        } else if (isForCloseModal) {
            props.onSet(company)
        }
        if (props.onAfterSave) {
            props.onAfterSave(feedbackMessage, company, isForCloseModal)
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
