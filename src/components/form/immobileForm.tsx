import Form from "./form";
import FormRow from "./formRow";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import { useEffect, useState } from "react";
import InputText from "../inputText/inputText";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import InputImmobilePoints from "../inputText/inputImmobilePoints";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import { handleImmobileValidationForDB } from "../../util/validationUtil";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareImmobileForDB } from "../../util/converterUtil";

interface ImmobileFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    isForOldRegister?: boolean,
    immobile?: Immobile,
    onBack?: (object?) => void,
    onSelectPerson?: (object) => void,
    onAfterSave?: (object, any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ImmobileForm(props: ImmobileFormProps) {
    const [immobileOriginal, setImmobileOriginal] = useState<Immobile>(props?.immobile ?? defaultImmobile)
    const [immobile, setImmobile] = useState<Immobile>(props?.immobile ?? defaultImmobile)
    const [isFormValid, setIsFormValid] = useState(handleImmobileValidationForDB(immobile).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.immobile?.oldData ?? defaultElementFromBase)

    const handleSetImmobileName = (value) => { setImmobile({ ...immobile, name: value }) }
    const handleSetImmobileLand = (value) => { setImmobile({ ...immobile, land: value }) }
    const handleSetImmobileArea = (value) => { setImmobile({ ...immobile, area: value }) }
    const handleSetImmobileCounty = (value) => { setImmobile({ ...immobile, county: value }) }
    const handleSetImmobileOwners = (value) => { setImmobile({ ...immobile, owners: value }) }
    const handleSetImmobilePoints = (value) => { setImmobile({ ...immobile, points: value }) }
    const handleSetImmobileAddress = (value) => { setImmobile({ ...immobile, address: value }) }
    const handleSetImmobilePerimeter = (value) => { setImmobile({ ...immobile, perimeter: value }) }

    const handleDiference = (): boolean => {
        let hasDiference = false
        Object.keys(immobileOriginal)?.map((element, index) => {
            if (immobile[element] !== immobileOriginal[element]) {
                hasDiference = true
            }
        })
        return hasDiference
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleSave = async () => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo estranho aconteceu"], messageType: "WARNING" }
        let immobileForDB = { ...immobile }
        const isValid = handleImmobileValidationForDB(immobileForDB)
        if (isValid.validation) {
            immobileForDB = handlePrepareImmobileForDB(immobileForDB)
            let nowID = immobileForDB?.id ?? ""
            const isSave = nowID === ""
            let res = { status: "ERROR", id: nowID, message: "" }
            if (isSave) {
                feedbackMessage = { ...feedbackMessage, messages: ["Salvo com sucesso!"], messageType: "SUCCESS" }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Atualizado com sucesso!"], messageType: "SUCCESS" }
            }
            try {
                res = await fetch("api/immobile", {
                    method: "POST",
                    body: JSON.stringify({ token: "tokenbemseguro", data: immobileForDB }),
                }).then((res) => res.json())
            } catch (e) {
                if (isSave) {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em salvar!"], messageType: "ERROR" }
                } else {
                    feedbackMessage = { ...feedbackMessage, messages: ["Erro em Atualizadar!"], messageType: "ERROR" }
                }
                console.error("Error adding document: ", e)
            }
            if (res.status === "SUCCESS") {
                setImmobile({ ...immobile, id: res.id })
                immobileForDB = { ...immobileForDB, id: res.id }

                if (isMultiple) {
                    setImmobile(defaultImmobile)
                }

                if (!isMultiple && props.onAfterSave) {
                    props.onAfterSave(feedbackMessage, immobileForDB)
                }
            } else {
                feedbackMessage = { ...feedbackMessage, messages: ["Erro!"], messageType: "ERROR" }
            }

            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        } else {
            feedbackMessage = { ...feedbackMessage, messages: isValid.messages, messageType: "ERROR" }
            if (props.onShowMessage) {
                props.onShowMessage(feedbackMessage)
            }
        }
        setIsLoading(false)
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                }}>

                <FormRow className="p-2">
                    <FormRowColumn unit="6">
                        <ActionButtonsForm
                            isLeftOn
                            isForBackControl
                            isDisabled={!isFormValid}
                            rightWindowText="Deseja confirmar as alterações?"
                            isForOpenLeft={immobile.id !== "" && handleDiference()}
                            isForOpenRight={immobile.id !== "" && handleDiference()}
                            rightButtonText={immobile.id === "" ? "Salvar" : "Editar"}
                            leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                            onLeftClick={(event) => {
                                event.preventDefault()
                                handleOnBack()
                            }}
                            onRightClick={(event) => {
                                event.preventDefault()
                                handleSave()
                            }}
                        />
                    </FormRowColumn>
                </FormRow>

                <Form
                    title={props.title}
                    subtitle={props.subtitle}>

                    {props.canMultiple && (
                        <FormRow>
                            <FormRowColumn unit="6">
                                <InputCheckbox
                                    id="multiple"
                                    value={isMultiple}
                                    isLoading={isLoading}
                                    onSetText={setIsMultiple}
                                    title="Cadastro multiplo?"
                                    isDisabled={props.isForDisable}
                                />
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                id="immobilename"
                                value={immobile.name}
                                isLoading={isLoading}
                                title="Nome do imóvel"
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome do imóvel não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="land"
                                title="Gleba"
                                value={immobile.land}
                                isLoading={isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileLand}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A gleba não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="county"
                                title="Município/UF"
                                isLoading={isLoading}
                                value={immobile.county}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileCounty}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O município não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="area"
                                mask="area"
                                title="Área"
                                isLoading={isLoading}
                                value={immobile.area}
                                validation={NUMBER_MARK}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobileArea}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A área não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="perimeter"
                                mask="perimeter"
                                title="Perímetro"
                                isLoading={isLoading}
                                validation={NUMBER_MARK}
                                value={immobile.perimeter}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetImmobilePerimeter}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O perímetro não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <SelectPersonCompanyForm
                title="Proprietários"
                isLoading={isLoading}
                isMultipleSelect={true}
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                personsAndCompanies={immobile.owners}
                onSetPersonsAndCompanies={handleSetImmobileOwners}
                validationMessage="Esta pessoa, ou empresa já é um proprietário"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                }}>

                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    address={immobile.address}
                    setAddress={handleSetImmobileAddress}
                    subtitle="Informações sobre o endereço"
                />

                <InputImmobilePoints
                    canTest
                    points={immobile.points}
                    onSetPoints={handleSetImmobilePoints}
                />

                <FormRow className="p-2">
                    <FormRowColumn unit="6">
                        <ActionButtonsForm
                            isLeftOn
                            isDisabled={!isFormValid}
                            rightWindowText="Deseja confirmar as alterações?"
                            isForOpenLeft={immobile.id !== "" && handleDiference()}
                            isForOpenRight={immobile.id !== "" && handleDiference()}
                            rightButtonText={immobile.id === "" ? "Salvar" : "Editar"}
                            leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                            onLeftClick={(event) => {
                                event.preventDefault()
                                handleOnBack()
                            }}
                            onRightClick={(event) => {
                                event.preventDefault()
                                handleSave()
                            }}
                        />
                    </FormRowColumn>
                </FormRow>
            </form>
        </>
    )
}