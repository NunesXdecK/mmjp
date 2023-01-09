import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import { NavBarPath } from "../bar/navBar";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { ImmobilePoint } from "../../interfaces/objectInterfaces";
import { NUMBER_MARK, NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputTextArea from "../inputText/inputTextArea";
import InputPointId from "../inputText/inputPointId";

interface ImmobilePointDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isProfile?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    immobilePoint?: ImmobilePoint,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export default function ImmobilePointDataForm(props: ImmobilePointDataFormProps) {
    const [isFormValid, setIsFormValid] = useState(true)
    const handleSetType = (value) => { handleSet({ ...props.immobilePoint, type: value }) }
    const handleSetPointId = (value) => { handleSet({ ...props.immobilePoint, pointId: value }) }
    const handleSetEastingX = (value) => { handleSet({ ...props.immobilePoint, eastingX: value }) }
    const handleSetGNSSType = (value) => { handleSet({ ...props.immobilePoint, gnssType: value }) }
    const handleSetFrequency = (value) => { handleSet({ ...props.immobilePoint, frequency: value }) }
    const handleSetNorthingY = (value) => { handleSet({ ...props.immobilePoint, northingY: value }) }
    const handleSetPosnQuality = (value) => { handleSet({ ...props.immobilePoint, posnQuality: value }) }
    const handleSetDescription = (value) => { handleSet({ ...props.immobilePoint, description: value }) }
    const handleSetSolutionType = (value) => { handleSet({ ...props.immobilePoint, solutionType: value }) }
    const handleSetStoredStatus = (value) => { handleSet({ ...props.immobilePoint, storedStatus: value }) }
    const handleSetHeightQuality = (value) => { handleSet({ ...props.immobilePoint, heightQuality: value }) }
    const handleSetElipseHeightZ = (value) => { handleSet({ ...props.immobilePoint, elipseHeightZ: value }) }
    const handleSetAmbiguityStatus = (value) => { handleSet({ ...props.immobilePoint, ambiguityStatus: value }) }
    const handleSetPosnHeightQuality = (value) => { handleSet({ ...props.immobilePoint, posnHeightQuality: value }) }

    const handleSet = (value: ImmobilePoint) => {
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
        <Form
            title={props.title ?? "Dados básicos"}
            subtitle={props.subtitle ?? "Informe os dados básicos"}
        >
            <FormRow>
                <FormRowColumn unit="4">
                    <InputPointId
                        id="immobile-point-id"
                        onSet={handleSetPointId}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.immobilePoint.pointId}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Epoch"
                        isDisabled={true}
                        id="immobile-epoch"
                        value={props.immobilePoint.epoch}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputText
                        title="Easting (X)"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        id="immobile-point-easting-x"
                        onSetText={handleSetEastingX}
                        isDisabled={props.isDisabled}
                        value={props.immobilePoint.eastingX}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O X não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Norting (Y)"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        id="immobile-point-northing-x"
                        onSetText={handleSetNorthingY}
                        value={props.immobilePoint.northingY}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O Y não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        validation={NUMBER_MARK}
                        title="Elipse Height (Z)"
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetElipseHeightZ}
                        id="immobile-point-elipse-height-x"
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.elipseHeightZ}
                        validationMessage="O Z não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputText
                        title="Qualidade POSN"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        id="immobile-point-posn-quality"
                        onSetText={handleSetPosnQuality}
                        value={props.immobilePoint.posnQuality}
                        onValidate={handleChangeFormValidation}
                        validationMessage="A qualidade POSN não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        validation={NUMBER_MARK}
                        title="Qualidade da altura"
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        id="immobile-point-height-quality"
                        onSetText={handleSetHeightQuality}
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.heightQuality}
                        validationMessage="A qualidade da altura não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        validation={NUMBER_MARK}
                        title="Qualidade POSN+Altura"
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetPosnHeightQuality}
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.posnHeightQuality}
                        id="immobile-point-elipse-posn-height-quality"
                        validationMessage="A qualidade POSN+altura não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputText
                        title="Status de ambiguidade"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetAmbiguityStatus}
                        id="immobile-point-ambiguity-status"
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.ambiguityStatus}
                        validationMessage="O status de ambiguidade não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Frequencia"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        id="immobile-point-frequency"
                        onSetText={handleSetFrequency}
                        value={props.immobilePoint.frequency}
                        onValidate={handleChangeFormValidation}
                        validationMessage="A frequencia não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Tipo de GNSS"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        id="immobile-point-gnss-type"
                        isDisabled={props.isDisabled}
                        onSetText={handleSetGNSSType}
                        value={props.immobilePoint.gnssType}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O tipo de GNSS não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <InputText
                        title="Tipo de solução"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetSolutionType}
                        id="immobile-point-solution-type"
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.ambiguityStatus}
                        validationMessage="O tipo de solução não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        title="Status de armazenamento"
                        id="immobile-point-stored-status"
                        onSetText={handleSetStoredStatus}
                        onValidate={handleChangeFormValidation}
                        value={props.immobilePoint.frequency}
                        validationMessage="O status de armazenamento não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <InputText
                        title="Tipo"
                        id="immobile-point-type"
                        onSetText={handleSetType}
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.immobilePoint.gnssType}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O tipo não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição"
                        onBlur={props.onBlur}
                        id="point-description"
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetDescription}
                        value={props.immobilePoint.description}
                    />
                </FormRowColumn>
            </FormRow>
        </Form>
    )
}
