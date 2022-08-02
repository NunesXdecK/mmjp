import { useState } from "react";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/outline";
import InputCheckbox from "../inputText/inputCheckbox";
import InputTextArea from "../inputText/inputTextArea";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { ServiceStage } from "../../interfaces/objectInterfaces";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { handleServiceStageValidationForDB } from "../../util/validationUtil";
import FormRow from "../form/formRow";
import FormRowColumn from "../form/formRowColumn";
import ScrollDownTransition from "../animation/scrollDownTransition";

interface ServiceStageDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    serviceStages?: ServiceStage[],
    onDelete?: (number) => void,
    onSetText?: (any, number) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStageDataForm(props: ServiceStageDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [index, setIndex] = useState(props.index ?? 0)

    const [isFormValid, setIsFormValid] = useState(handleServiceStageValidationForDB(props.serviceStages[index]).validation)

    const [professionals, setProfessionals] = useState(props.serviceStages[index].responsible?.id ? [props.serviceStages[index].responsible] : [])

    const handleSetServiceStageProfessional = (value) => {
        setProfessionals(value)
        handleSetText({ ...props.serviceStages[index], responsible: value[0] })
    }
    const handleSetServiceStageTitle = (value) => { handleSetText({ ...props.serviceStages[index], title: value }) }
    const handleSetServiceStageDate = (value) => { handleSetText({ ...props.serviceStages[index], dateString: value }) }
    const handleSetServiceStageFinished = (value) => { handleSetText({ ...props.serviceStages[index], finished: value }) }
    const handleSetServiceStageDescription = (value) => { handleSetText({ ...props.serviceStages[index], description: value }) }

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
            <FormRow className="py-2">
                <FormRowColumn unit="1" className="mt-0 sm:mt-6">
                    <Button
                        isLight
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onClick={() => {
                            setIsFormOpen(!isFormOpen)
                        }}
                    >
                        {isFormOpen ? (
                            <ChevronDownIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                        ) : (
                            <ChevronRightIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                        )}
                    </Button>
                </FormRowColumn>
                <FormRowColumn unit="3">
                    <InputTextAutoComplete
                        title="Titulo"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        sugestions={["Planta", "Memorial"]}
                        id={"title-" + index + "-" + props.id}
                        onSetText={handleSetServiceStageTitle}
                        onValidate={handleChangeFormValidation}
                        value={props.serviceStages[index].title}
                        validationMessage="O titulo não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Prazo final"
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetServiceStageDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-" + index + "-" + props.id}
                        value={props.serviceStages[index].dateString}
                    />
                </FormRowColumn>

                {props.onDelete && (
                    <FormRowColumn unit="1" className="mt-0 sm:mt-6 justify-self-end">
                        <Button
                            color="red"
                            className="mr-2 group"
                            isLoading={props.isLoading}
                            isDisabled={props.isForDisable}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                        </Button>
                    </FormRowColumn>
                )}
            </FormRow>
            <ScrollDownTransition
                isOpen={isFormOpen}>
                <>
                    <FormRow>
                        <FormRowColumn unit="1">
                            <InputText
                                id="status"
                                isDisabled={true}
                                value={props.serviceStages[index].status}
                                title="Status da etapa"
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6" className="">
                            <InputTextArea
                                title="Descrição da etapa"
                                isLoading={props.isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetServiceStageDescription}
                                id={"description-" + index + "-" + props.id}
                                value={props.serviceStages[index].description}
                            />
                        </FormRowColumn>
                    </FormRow>

                </>
            </ScrollDownTransition>

            <ScrollDownTransition
                isOpen={isFormOpen}>
                <SelectProfessionalForm
                    formClassName="p-1 m-2"
                    isMultipleSelect={false}
                    isLoading={props.isLoading}
                    professionals={professionals}
                    onShowMessage={props.onShowMessage}
                    buttonTitle="Adicionar profissional"
                    validationMessage="Esta pessoa já é um profissional"
                    onSetProfessionals={handleSetServiceStageProfessional}
                />
            </ScrollDownTransition>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.serviceStages[index].description}?</p>
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