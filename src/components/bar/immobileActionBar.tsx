import ActionBar from "./actionBar";
import Button from "../button/button";
import MenuButton from "../button/menuButton";
import DropDownButton from "../button/dropDownButton";
import { handleRemoveCEPMask } from "../../util/maskUtil";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { handleValidationNotNull, ValidationReturn } from "../../util/validationUtil";
import { Immobile, defaultImmobile, ImmobileStatus, Person, Company } from "../../interfaces/objectInterfaces";

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

export const handleImmobileValidationForDB = (immobile: Immobile) => {
    let validation: ValidationReturn = { validation: false, messages: [] }
    let nameCheck = handleValidationNotNull(immobile?.name)
    let ownersCheck = immobile?.owners?.length > 0 ?? false
    let ownersOnBaseCheck = true

    if (!nameCheck) {
        validation = { ...validation, messages: [...validation.messages, "O campo nome está em branco."] }
    }

    if (!ownersCheck) {
        validation = { ...validation, messages: [...validation.messages, "O imóvel precisa de ao menos um proprietário."] }
    }
    immobile.owners.map((element, index) => {
        if (element?.id === 0) {
            ownersOnBaseCheck = false
            validation = { ...validation, messages: [...validation.messages, "O proprietário não está cadastrado na base."] }
        }
    })
    validation = { ...validation, validation: nameCheck && ownersOnBaseCheck }
    return validation
}

export const handleImmobileForDB = (immobile: Immobile) => {
    let owners = []
    if (immobile?.owners?.length > 0) {
        immobile.owners?.map((element: (Person | Company), index) => {
            if (element?.id > 0) {
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
        name: immobile?.name?.trim(),
        land: immobile?.land?.trim(),
        county: immobile?.county?.trim(),
        address: { ...immobile?.address, cep: handleRemoveCEPMask(immobile?.address?.cep) }
    }
    return immobile
}

export const handleSaveImmobileInner = async (immobile, history) => {
    let res = { status: "ERROR", id: 0, immobile: immobile }
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

    const handleSave = async (status: ImmobileStatus, isForCloseModal) => {
        handleSetIsLoading(true)
        let immobile = props.immobile
        if (status?.length > 0) {
            immobile = { ...immobile, status: status }
        }
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
            <div className="w-full flex flex-row justify-between flex-wrap">
                <div className="flex flex-row gap-2 flex-wrap">
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.immobile.status, true)}
                    >
                        Salvar
                    </Button>
                    <Button
                        isLoading={props.isLoading}
                        onClick={() => handleSave(props.immobile.status, false)}
                    >
                        Salvar e sair
                    </Button>
                    <div className="hidden sm:flex sm:flex-row gap-2 flex-wrap">
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.immobile.status === "NORMAL"}
                            isDisabled={props.immobile.status === "NORMAL"}
                            onClick={() => handleSave("NORMAL", true)}
                        >
                            Normalizar imóvel
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.immobile.status === "UNIFICADO"}
                            isDisabled={props.immobile.status === "UNIFICADO"}
                            onClick={() => handleSave("UNIFICADO", true)}
                        >
                            Unificar imóvel
                        </Button>
                        <Button
                            isLoading={props.isLoading}
                            isHidden={props.immobile.status === "DESMEMBRADO"}
                            isDisabled={props.immobile.status === "DESMEMBRADO"}
                            onClick={() => handleSave("DESMEMBRADO", true)}
                        >
                            Desmembrar imóvel
                        </Button>
                    </div>
                </div>
                <div className="block sm:hidden">
                    <DropDownButton
                        isLeft
                        title="..."
                        isLoading={props.isLoading}
                    >
                        <div className="w-full flex flex-col">
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.immobile.status === "NORMAL"}
                                isDisabled={props.immobile.status === "NORMAL"}
                                onClick={() => {
                                    handleSave("NORMAL", true)
                                }}
                            >
                                Normalizar imóvel
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.immobile.status === "UNIFICADO"}
                                isDisabled={props.immobile.status === "UNIFICADO"}
                                onClick={() => {
                                    handleSave("UNIFICADO", true)
                                }}
                            >
                                Unificar imóvel
                            </MenuButton>
                            <MenuButton
                                isLoading={props.isLoading}
                                isHidden={props.immobile.status === "DESMEMBRADO"}
                                isDisabled={props.immobile.status === "DESMEMBRADO"}
                                onClick={() => {
                                    handleSave("DESMEMBRADO", true)
                                }}
                            >
                                Desmembrar imóvel
                            </MenuButton>
                        </div>
                    </DropDownButton>
                </div>
            </div>
        </ActionBar>
    )
}
