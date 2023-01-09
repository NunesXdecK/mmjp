import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import AddressForm from "./addressForm";
import { NavBarPath } from "../bar/navBar";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputSelect from "../inputText/inputSelect";
import { Immobile } from "../../interfaces/objectInterfaces";
import InputImmobilePoints from "../inputText/inputImmobilePoints";
import SelectPersonCompanyForm from "../select/selectPersonCompanyForm";
import { CCIR_MARK, NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import SelectImmobilePointForm from "../select/selectImmobilePointForm";

interface ImmobileDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    immobile?: Immobile,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
    onSetIsLoading?: (boolean) => void,
}

export default function ImmobileDataForm(props: ImmobileDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetName = (value) => { handleSet({ ...props.immobile, name: value }) }
    const handleSetLand = (value) => { handleSet({ ...props.immobile, land: value }) }
    const handleSetArea = (value) => { handleSet({ ...props.immobile, area: value }) }
    const handleSetCounty = (value) => { handleSet({ ...props.immobile, county: value }) }
    const handleSetPoints = (value) => { handleSet({ ...props.immobile, points: value }) }
    const handleSetOwners = (value) => { handleSet({ ...props.immobile, owners: value }) }
    const handleSetAddress = (value) => { handleSet({ ...props.immobile, address: value }) }
    const handleSetComarca = (value) => { handleSet({ ...props.immobile, comarca: value }) }
    const handleSetProcess = (value) => { handleSet({ ...props.immobile, process: value }) }
    const handleSetPerimeter = (value) => { handleSet({ ...props.immobile, perimeter: value }) }
    const handleSetCCRINumber = (value) => { handleSet({ ...props.immobile, ccirNumber: value }) }
    const handleSetComarcaCode = (value) => { handleSet({ ...props.immobile, comarcaCode: value }) }
    const handleSetRegistration = (value) => { handleSet({ ...props.immobile, registration: value }) }

    const handleSet = (value: Immobile) => {
        if (props.onSet) {
            if (props.index) {
                props.onSet(value, props.index)
            } else {
                props.onSet(value)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            <Form
                title={props.title ?? "Dados básicos"}
                subtitle={props.subtitle ?? "Informe os dados básicos"}
            >
                <FormRow>
                    <FormRowColumn unit="4">
                        <InputText
                            id="immobile-name"
                            title="Nome do imóvel"
                            onSetText={handleSetName}
                            validation={NOT_NULL_MARK}
                            value={props.immobile.name}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O nome do imóvel não pode ficar em branco."
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="2">
                        <InputText
                            id="status"
                            isDisabled={true}
                            value={props.immobile.status}
                            title="Status do imóvel"
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="Gleba"
                            id="immobile-land"
                            onSetText={handleSetLand}
                            value={props.immobile.land}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="A gleba não pode ficar em branco."
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="3">
                        <InputText
                            id="immobile-county"
                            title="Município/UF"
                            onSetText={handleSetCounty}
                            isLoading={props.isLoading}
                            value={props.immobile.county}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O município não pode ficar em branco."
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            mask="area"
                            title="Área"
                            id="immobile-area"
                            validation={NUMBER_MARK}
                            onSetText={handleSetArea}
                            isLoading={props.isLoading}
                            value={props.immobile.area}
                            isDisabled={props.isDisabled}
                            onValidate={handleChangeFormValidation}
                            validationMessage="A área não pode ficar em branco."
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="3">
                        <InputText
                            mask="perimeter"
                            title="Perímetro"
                            id="immobile-perimeter"
                            validation={NUMBER_MARK}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetPerimeter}
                            value={props.immobile.perimeter}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O perímetro não pode ficar em branco."
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="Comarca"
                            id="immobile-comarca"
                            isLoading={props.isLoading}
                            onSetText={handleSetComarca}
                            isDisabled={props.isDisabled}
                            value={props.immobile.comarca}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="3">
                        <InputSelect
                            title="Codigo da comarca"
                            id="immobile-comarca-code"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetComarcaCode}
                            value={props.immobile.comarcaCode}
                            options={["123654", "752132", "875643", "8775643", "132161"]}
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="Processo"
                            id="immobile-process"
                            isLoading={props.isLoading}
                            onSetText={handleSetProcess}
                            isDisabled={props.isDisabled}
                            value={props.immobile.process}
                        />
                    </FormRowColumn>
                    <FormRowColumn unit="3">
                        <InputText
                            mask="ccir"
                            title="CCIR"
                            maxLength={17}
                            id="immobile-ccir"
                            validation={CCIR_MARK}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetCCRINumber}
                            value={props.immobile.ccirNumber}
                            onValidate={handleChangeFormValidation}
                            validationMessage="O CCIR está invalido"
                        />
                    </FormRowColumn>
                </FormRow>
                <FormRow>
                    <FormRowColumn unit="3">
                        <InputText
                            title="Matricula"
                            id="immobile-registration"
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetRegistration}
                            value={props.immobile.registration}
                        />
                    </FormRowColumn>
                </FormRow>
            </Form>
            <SelectPersonCompanyForm
                isFull
                id="immobile-owners"
                title="Proprietários"
                onSet={handleSetOwners}
                prevPath={props.prevPath}
                isLoading={props.isLoading}
                value={props.immobile.owners}
                isDisabled={props.isDisabled}
                immobileId={props.immobile?.id}
                subtitle="Selecione o proprietário"
                onShowMessage={props.onShowMessage}
                excludeList={props.immobile.owners}
                isDisabledExclude={props.isDisabled}
                onSetIsLoading={props.onSetIsLoading}
                placeholder="Pesquise o proprietário..."
            />
            <SelectImmobilePointForm
                title="Pontos"
                id="immobile-point"
                onSet={handleSetPoints}
                prevPath={props.prevPath}
                isLoading={props.isLoading}
                subtitle="Selecione o ponto"
                value={props.immobile.points}
                isDisabled={props.isDisabled}
                immobileId={props.immobile?.id}
                placeholder="Pesquise o ponto..."
                onShowMessage={props.onShowMessage}
                excludeList={props.immobile.owners}
                isDisabledExclude={props.isDisabled}
                onSetIsLoading={props.onSetIsLoading}
            />
            {/*
            <InputImmobilePoints
                canTest
                isLoading={props.isLoading}
                onSetPoints={handleSetPoints}
                points={props.immobile.points}
                title="Pontos geograficos do imóvel"
            />
            */}
            <AddressForm
                title="Endereço"
                isLoading={props.isLoading}
                setAddress={handleSetAddress}
                address={props.immobile.address}
                subtitle="Informações sobre o endereço"
            />
        </>
    )
}
