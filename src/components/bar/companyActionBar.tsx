import ActionBar from "./actionBar";
import Button from "../button/button";
import { handleCheckCNPJ } from "../inputText/inputCNPJ";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleCheckClientCode } from "../inputText/inputClientCode";
import { Company, defaultCompany } from "../../interfaces/objectInterfaces";
import { handleRemoveCEPMask, handleRemoveCNPJMask, handleRemoveTelephoneMask } from "../../util/maskUtil";
import { handleValidationCPF, handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";

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

export const handleCompanyValidationForDB = (company: Company) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(company.name)
    let cnpjCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    if (!handleValidationCPF(company?.cnpj)) {
        validation = { ...validation, messages: [...validation.messages, "O campo CNPJ está invalido."] }
        cnpjCheck = false
    }

    validation = { ...validation, validation: nameCheck && cnpjCheck }
    return validation
}

export const handleCompanyForDB = (company: Company) => {
    if (company.address && company.address?.cep) {
        company = { ...company, address: { ...company.address, cep: handleRemoveCEPMask(company.address.cep) } }
    }
    let telephonesWithNoMask = []
    if (company.telephones && company.telephones.length) {
        company.telephones?.map((element, index) => {
            telephonesWithNoMask = [...telephonesWithNoMask, { ...element, value: handleRemoveTelephoneMask(element.value) }]
        })
    }
    company = {
        ...company,
        name: company.name?.trim(),
        telephones: telephonesWithNoMask,
        cnpj: handleRemoveCNPJMask(company.cnpj),
    }
    return company
}

export const handleSaveCompanyInner = async (company, history) => {
    let res = { status: "ERROR", id: 0, company: company }
    company = handleCompanyForDB(company)
    try {
        const saveRes = await fetch("api/company", {
            method: "POST",
            body: JSON.stringify({ token: "tokenbemseguro", data: company, history: history }),
        }).then((res) => res.json())
        res = { ...res, status: saveRes.status, id: saveRes.id, company: { ...company, id: saveRes.id } }
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

    const handleCompanyValidationForDBInner = (company: Company, isSearching, isCNPJ) => {
        let isValid = handleCompanyValidationForDB(company)
        if (company.clientCode?.toString().length > 0) {
            if (isSearching) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O codigo do cliente já está em uso."]
                }
            }
        }
        if (company.cnpj.length > 0) {
            if (isCNPJ) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O CNPJ já está em uso."]
                }
            }
        }
        return isValid
    }

    const handleSave = async (isForCloseModal) => {
        handleSetIsLoading(true)
        let company = props.company
        let resCNPJ = await handleCheckCNPJ(company.cnpj, company.id)
        let resCC = await handleCheckClientCode(company.clientCode, company.id)
        const isValid = handleCompanyValidationForDBInner(company, resCC.data, resCNPJ.data)
        if (!isValid.validation) {
            handleSetIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let res = await handleSaveCompanyInner(company, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            handleSetIsLoading(false)
            return
        }
        company = { ...company, id: res.id }
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
                <div className="flex flex-row gap-2">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(false)}
                    >
                        Salvar e sair
                    </Button>
                </div>
            </div>
        </ActionBar>
    )
}
