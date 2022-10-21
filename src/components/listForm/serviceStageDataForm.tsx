import { useState } from "react";
import Button from "../button/button";
import FormRow from "../form/formRow";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import InputTextArea from "../inputText/inputTextArea";
import { NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { ServiceStage } from "../../interfaces/objectInterfaces";
import ScrollDownTransition from "../animation/scrollDownTransition";
import SelectUserForm from "../select/selectUserForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { handleServiceStageValidationForDB } from "../../util/validationUtil";
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/outline";

interface ServiceStageDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isSingle?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForShowAll?: boolean,
    isDisabled?: boolean,
    serviceStage?: ServiceStage,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceStageDataForm(props: ServiceStageDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(props?.isSingle ? true : false)

    const [isFormValid, setIsFormValid] = useState(handleServiceStageValidationForDB(props.serviceStage).validation)

    const [users, setUsers] = useState(props.serviceStage.responsible?.id ? [props.serviceStage.responsible] : [])

    const handleSetServiceStageUser = (value) => {
        setUsers(value)
        handleSetText({ ...props.serviceStage, responsible: value[0] })
    }
    const handleSetServiceStageTitle = (value) => { handleSetText({ ...props.serviceStage, title: value }) }
    const handleSetServiceStageDate = (value) => { handleSetText({ ...props.serviceStage, dateString: value }) }
    const handleSetServiceStageFinished = (value) => { handleSetText({ ...props.serviceStage, finished: value }) }
    const handleSetServiceStageDescription = (value) => { handleSetText({ ...props.serviceStage, description: value }) }

    const handleSetText = (element) => {
        if (props.onSet) {
            props.onSet(element, props.index)
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowButton = () => {
        return (
            <>
                {(props.isForShowAll || !props.isSingle) && (
                    <Button
                        isLight
                        isLoading={props.isLoading}
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
                )}
            </>
        )
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
                <FormRowColumn unit="6" className="sm:hidden block">
                    {handleShowButton()}
                </FormRowColumn>
                <FormRowColumn unit="4" className="flex flex-col sm:flex-row">
                    <div className="hidden sm:block mr-2 sm:mt-auto">
                        {handleShowButton()}
                    </div>

                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        holderClassName="w-full"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        sugestions={["Planta", "Memorial"]}
                        id={"title-" + props.index + "-" + props.id}
                        onSetText={handleSetServiceStageTitle}
                        onValidate={handleChangeFormValidation}
                        value={props.serviceStage.title}
                        validationMessage="O titulo não pode ficar em branco."
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputText
                        mask="date"
                        maxLength={10}
                        title="Prazo"
                        onBlur={props.onBlur}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServiceStageDate}
                        onValidate={handleChangeFormValidation}
                        id={"date-due-stages-" + props.index + "-" + props.id}
                        value={props.serviceStage.dateString}
                    />

                    {!props.isSingle && props.onDelete && !props.isDisabled && (
                        <Button
                            color="red"
                            isLoading={props.isLoading}
                            className="ml-2 mt-2 sm:mt-0 h-fit self-end"
                            isDisabled={props.isDisabled}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            <TrashIcon className="text-white block h-5 w-5" aria-hidden="true" />
                        </Button>
                    )}
                </FormRowColumn>
            </FormRow>
            <ScrollDownTransition
                isOpen={isFormOpen}>
                <>
                    <FormRow>
                        <FormRowColumn unit="2">
                            <InputText
                                id="status-stages"
                                isDisabled={true}
                                value={props.serviceStage.status}
                                title="Status"
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6" className="">
                            <InputTextArea
                                title="Descrição"
                                onBlur={props.onBlur}
                                isLoading={props.isLoading}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetServiceStageDescription}
                                id={"description-stages-" + props.index + "-" + props.id}
                                value={props.serviceStage.description}
                            />
                        </FormRowColumn>
                    </FormRow>

                </>
            </ScrollDownTransition>

            <ScrollDownTransition
                isOpen={isFormOpen}>
                <SelectUserForm
                    formClassName="p-1 m-2"
                    isMultipleSelect={false}
                    isLoading={props.isLoading}
                    users={users}
                    isLocked={props.isDisabled}
                    buttonTitle="Adicionar responsável"
                    onShowMessage={props.onShowMessage}
                    validationButton={users.length === 1}
                    onSetUsers={handleSetServiceStageUser}
                    validationMessage="Este responsavel já está selecionada"
                    validationMessageButton="Você não pode mais adicionar responsaveis"
                    onFinishAdd={() => {
                        {/*
                        if (props.onFinishAdd) {
                            props.onFinishAdd()
                        }
                    */}
                    }}
                />
            </ScrollDownTransition>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.serviceStage.description}?</p>
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
                                props.onDelete(props.index)
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