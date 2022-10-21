import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import InputImmobilePoints from "../inputText/inputImmobilePoints";
import ScrollDownTransition from "../animation/scrollDownTransition";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText";
import { defaultImmobile, Immobile } from "../../interfaces/objectInterfaces";
import { CCIR_MARK, NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleImmobileValidationForDB, handleIsEqual } from "../../util/validationUtil";
import { defaultElementFromBase, ElementFromBase, handlePrepareImmobileForDB } from "../../util/converterUtil";
import InputSelect from "../inputText/inputSelect";

interface ImmobileFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isDisabled?: boolean,
    isForOldRegister?: boolean,
    immobile?: Immobile,
    onBack?: (object?) => void,
    onSelectPerson?: (object) => void,
    onAfterSave?: (object, any?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ImmobileForm(props: ImmobileFormProps) {
    const [immobileID, setImmobileID] = useState(props?.immobile?.id?.length ? props?.immobile?.id : "")
    const [immobile, setImmobile] = useState<Immobile>(props?.immobile ?? defaultImmobile)
    const [immobileOriginal, setImmobileOriginal] = useState<Immobile>(props?.immobile ?? defaultImmobile)
    const [isFormValid, setIsFormValid] = useState(handleImmobileValidationForDB(immobile).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const [oldData, setOldData] = useState<ElementFromBase>(props?.immobile?.oldData ?? defaultElementFromBase)

    const handleSetImmobileName = (value) => { setImmobile({ ...immobile, name: value }) }
    const handleSetImmobileLand = (value) => { setImmobile({ ...immobile, land: value }) }
    const handleSetImmobileArea = (value) => { setImmobile({ ...immobile, area: value }) }
    const handleSetImmobileCounty = (value) => { setImmobile({ ...immobile, county: value }) }
    const handleSetImmobileOwners = (value) => { setImmobile({ ...immobile, owners: value }) }
    const handleSetImmobilePoints = (value) => { setImmobile({ ...immobile, points: value }) }
    const handleSetImmobileComarca = (value) => { setImmobile({ ...immobile, comarca: value }) }
    const handleSetImmobileProcess = (value) => { setImmobile({ ...immobile, process: value }) }
    const handleSetImmobileAddress = (value) => { setImmobile({ ...immobile, address: value }) }
    const handleSetImmobilePerimeter = (value) => { setImmobile({ ...immobile, perimeter: value }) }
    const handleSetImmobileCCRINumber = (value) => { setImmobile({ ...immobile, ccirNumber: value }) }
    const handleSetImmobileComarcaCode = (value) => { setImmobile({ ...immobile, comarcaCode: value }) }
    const handleSetImmobileRegistration = (value) => { setImmobile({ ...immobile, registration: value }) }


    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        return !handleIsEqual(immobile, immobileOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handlePrepareImmobileForDBInner = (immobile) => {
        let immobileForDB = { ...immobile }
        if (!immobileForDB?.id?.length && immobileID?.length) {
            immobileForDB = { ...immobileForDB, id: immobileID }
        }
        immobileForDB = handlePrepareImmobileForDB(immobileForDB)
        return immobileForDB
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving) {
            return
        }
        if (!handleDiference()) {
            return
        }
        const isValid = handleImmobileValidationForDB(immobile)
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(immobile, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setImmobileID(res.id)
        setImmobileOriginal(res.immobile)
    }

    const handleSaveInner = async (immobile, history) => {
        let res = { status: "ERROR", id: "", immobile: immobile }
        let immobileForDB = handlePrepareImmobileForDBInner(immobile)
        try {
            const saveRes = await fetch("api/immobile", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: immobileForDB, history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, immobile: { ...immobile, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        const isValid = handleImmobileValidationForDB(immobile)
        if (!isValid.validation) {
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        setIsLoading(true)
        let immobileFromDB = { ...immobile }
        let res = await handleSaveInner(immobile, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setImmobile({ ...immobile, id: res.id })
        setImmobileOriginal({ ...immobile, id: res.id })
        immobileFromDB = { ...res.immobile }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setImmobile(defaultImmobile)
            setImmobileOriginal(defaultImmobile)
            setImmobileID("")
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, immobileFromDB)
        }
        setIsLoading(false)
    }

    const handleActionBar = () => {
        return (
            <ActionButtonsForm
                isLeftOn
                isRightOn
                isForBackControl
                isDisabled={!isFormValid || isAutoSaving}
                rightWindowText="Deseja confirmar as alterações?"
                isForOpenLeft={immobile.id !== "" && handleDiference()}
                isForOpenRight={immobile.id !== "" && handleDiference()}
                rightButtonText={"Salvar"}
                leftWindowText="Dejesa realmente voltar e descartar as alterações?"
                onLeftClick={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                    handleOnBack()
                }}
                onRightClick={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                    handleSave()
                }}
            />
        )
    }

    return (
        <>
            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                {handleActionBar()}

                <ScrollDownTransition
                    isOpen={isAutoSaving}>
                    <Form>
                        <FeedbackMessageSaveText
                            isOpen={true}
                        />
                    </Form>
                </ScrollDownTransition>

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
                                    isDisabled={props.isDisabled}
                                />
                            </FormRowColumn>
                        </FormRow>
                    )}

                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                id="immobilename"
                                value={immobile.name}
                                isLoading={isLoading}
                                title="Nome do imóvel"
                                onBlur={handleAutoSave}
                                validation={NOT_NULL_MARK}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O nome do imóvel não pode ficar em branco."
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="status"
                                isDisabled={true}
                                value={immobile.status}
                                title="Status do imóvel"
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
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                validation={NUMBER_MARK}
                                isDisabled={props.isDisabled}
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
                                onBlur={handleAutoSave}
                                validation={NUMBER_MARK}
                                value={immobile.perimeter}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobilePerimeter}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O perímetro não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="comarca"
                                title="Comarca"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={immobile.comarca}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileComarca}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputSelect
                                id="comarca-code"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                title="Codigo da comarca"
                                value={immobile.comarcaCode}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileComarcaCode}
                                options={["123654", "752132", "875643", "8775643", "132161"]}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                id="process"
                                title="Processo"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={immobile.process}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileProcess}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="3">
                            <InputText
                                id="ccir"
                                mask="ccir"
                                title="CCIR"
                                maxLength={17}
                                isLoading={isLoading}
                                validation={CCIR_MARK}
                                onBlur={handleAutoSave}
                                value={immobile.ccirNumber}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileCCRINumber}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O CCIR está invalido"
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                title="Matricula"
                                id="registration"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                value={immobile.registration}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetImmobileRegistration}
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <SelectPersonCompanyForm
                title="Proprietários"
                isLoading={isLoading}
                isMultipleSelect={true}
                formClassName="p-1 m-3"
                onShowMessage={props.onShowMessage}
                buttonTitle="Adicionar proprietário"
                subtitle="Selecione os proprietários"
                personsAndCompanies={immobile.owners}
                onSetPersonsAndCompanies={handleSetImmobileOwners}
                validationMessage="Esta pessoa, ou empresa já é um proprietário"
            />

            <InputImmobilePoints
                canTest
                points={immobile.points}
                title="Pontos geograficos do imóvel"
                onSetPoints={handleSetImmobilePoints}
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>

                <AddressForm
                    title="Endereço"
                    isLoading={isLoading}
                    onBlur={handleAutoSave}
                    address={immobile.address}
                    setAddress={handleSetImmobileAddress}
                    subtitle="Informações sobre o endereço"
                />

                {handleActionBar()}
            </form>
        </>
    )
}