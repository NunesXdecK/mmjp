import FormRow from "./formRow";
import { useState } from "react";
import Button from "../button/button";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { TrashIcon } from "@heroicons/react/outline";
import InputCheckbox from "../inputText/inputCheckbox";
import { ProjectStage } from "../../interfaces/objectInterfaces";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleProjectStageValidationForDB } from "../../util/validationUtil";
import InputTextArea from "../inputText/inputTextArea";
import SelectProfessionalForm from "../select/selectProfessionalForm";

interface ProjectStageDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    projectStages?: ProjectStage[],
    onDelete?: (number) => void,
    onSetText?: (any, number) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProjectStageDataForm(props: ProjectStageDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [index, setIndex] = useState(props.index ?? 0)

    const [isFormValid, setIsFormValid] = useState(handleProjectStageValidationForDB(props.projectStages[index]).validation)

    const [professionals, setProfessionals] = useState(props.projectStages[index].responsible?.id ? [props.projectStages[index].responsible] : [])

    const handleSetProjectStageProfessional = (value) => {
        setProfessionals(value)
        handleSetText({ ...props.projectStages[index], responsible: value[0] })
    }
    const handleSetProjectStageTitle = (value) => { handleSetText({ ...props.projectStages[index], title: value }) }
    const handleSetProjectStageDate = (value) => { handleSetText({ ...props.projectStages[index], dateString: value }) }
    const handleSetProjectStageFinished = (value) => { handleSetText({ ...props.projectStages[index], finished: value }) }
    const handleSetProjectStageDescription = (value) => { handleSetText({ ...props.projectStages[index], description: value }) }

    const handleSetText = (element) => {
        if (props.onSetText) {
            props.onSetText(element, index)
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    return (
        <>
            {/*
            <FormRow>
                <FormRowColumn unit="6">
                    <span>{index + 1}</span>
                </FormRowColumn>
            </FormRow>
                */}
            <FormRow>
                <FormRowColumn unit="4">
                    <InputTextAutoComplete
                        title="Titulo"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        sugestions={["Planta", "Memorial"]}
                        id={"title-" + index + "-" + props.id}
                        onSetText={handleSetProjectStageTitle}
                        onValidate={handleChangeFormValidation}
                        value={props.projectStages[index].title}
                        validationMessage="O titulo não pode ficar em branco."
                    />
                </FormRowColumn>

                <FormRowColumn unit="2">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Prazo final"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetProjectStageDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-" + index + "-" + props.id}
                        value={props.projectStages[index].dateString}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6">

                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputTextArea
                        title="Descrição da etapa"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetProjectStageDescription}
                        id={"description-" + index + "-" + props.id}
                        value={props.projectStages[index].description}
                    />
                </FormRowColumn>
            </FormRow>

            <FormRow>
                <FormRowColumn unit="6" className="">
                    <InputCheckbox
                        title="Finalizado?"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        id={"finished-" + index + "-" + props.id}
                        onSetText={handleSetProjectStageFinished}
                        value={props.projectStages[index].finished}
                    />
                </FormRowColumn>
            </FormRow>


            <FormRow>
                <FormRowColumn unit="6" className="">
                    <SelectProfessionalForm
                        isMultipleSelect={false}
                        isLoading={props.isLoading}
                        professionals={professionals}
                        onShowMessage={props.onShowMessage}
                        buttonTitle="Adicionar profissional"
                        onSetProfessionals={handleSetProjectStageProfessional}
                        validationMessage="Esta pessoa já é um profissional"
                    />
                </FormRowColumn>
            </FormRow>

            {props.onDelete && (
                <FormRow>
                    <FormRowColumn unit="6" className="flex content-end justify-end">
                        <Button
                            color="red"
                            className="mr-2 group"
                            isLoading={props.isLoading}
                            isDisabled={props.isForDisable}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <div className="flex flex-row">
                                <span className="mr-2">Excluir</span>
                                <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                            </div>
                        </Button>
                    </FormRowColumn>
                </FormRow>
            )}

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar?</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={(event) => {
                            event.preventDefault()
                            setIsOpen(false)
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault()
                            if (props.onDelete) {
                                props.onDelete(index)
                            }
                            setIsOpen(false)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}