import { useState } from "react";
import FormRow from "../form/formRow";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import ServiceStageForm from "./serviceStageForm";
import ServicePaymentForm from "./servicePaymentForm";
import InputTextArea from "../inputText/inputTextArea";
import { handleMountNumberCurrency } from "../../util/maskUtil";
import ScrollDownTransition from "../animation/scrollDownTransition";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { handleServiceValidationForDB } from "../../util/validationUtil";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { Service, defaultServicePayment } from "../../interfaces/objectInterfaces";
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/outline";
import SelectImmobileForm from "../select/selectImmobileForm";

interface ServiceDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    index?: number,
    isBack?: boolean,
    isLoading?: boolean,
    isForSelect?: boolean,
    isForDisable?: boolean,
    services?: Service[],
    onDelete?: (number) => void,
    onSetText?: (any, number) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceDataForm(props: ServiceDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [index, setIndex] = useState(props.index ?? 0)

    const [valueTotal, setValueTotal] = useState("0")
    const [isFormValid, setIsFormValid] = useState(handleServiceValidationForDB(props.services[index]).validation)

    const [professionals, setProfessionals] = useState(props.services[index]?.id ? [props.services[index]] : [])
    const [servicePayments, setServicePayments] = useState(props.services[index]?.servicePayments ?? [])

    const handleSetServiceTitle = (value) => { handleSetText({ ...props.services[index], title: value }) }
    const handleSetServiceDate = (value) => { handleSetText({ ...props.services[index], dateString: value }) }
    const handleSetServiceStages = (value) => { handleSetText({ ...props.services[index], serviceStages: value }) }
    const handleSetServiceDescription = (value) => { handleSetText({ ...props.services[index], description: value }) }
    const handleSetServiceImmobilesTarget = (value) => { handleSetText({ ...props.services[index], immobilesTarget: value }) }
    const handleSetServiceImmobilesOrigin = (value) => { handleSetText({ ...props.services[index], immobilesOrigin: value }) }
    const handleSetServicePayments = (value) => {
        setServicePayments(value)
        handleSetText({ ...props.services[index], servicePayments: value })
    }

    const handleSetServiceProfessional = (value) => {
        setProfessionals(value)
        handleSetText({ ...props.services[index], responsible: value[0] })
    }

    const handleSetServiceValue = (value) => {
        handleCalculateTotal(value, props.services[index].quantity)
        handleSetText({ ...props.services[index], value: value })
    }

    const handleSetServiceQuantity = (value) => {
        handleCalculateTotal(props.services[index].value, value)
        handleSetText({ ...props.services[index], quantity: value })
    }

    const handlePutPayment = (valueTotal) => {
        if (valueTotal > -1) {
            const list = [
                {
                    ...defaultServicePayment,
                    index: 0,
                    description: "Entrada",
                    dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
                    value: handleMountNumberCurrency((valueTotal / 2).toString(), ".", ",", 3, 2,),
                },
                {
                    ...defaultServicePayment,
                    index: 1,
                    description: "Entrega",
                    dateString: handleUTCToDateShow(handleNewDateToUTC().toString()),
                    value: handleMountNumberCurrency((valueTotal / 2).toString(), ".", ",", 3, 2),
                },
            ]
            setServicePayments(list)
        }
    }

    const handleCalculateTotal = (value: string, quantity: string) => {
        let valueFinal = 0
        let quantityFinal = 0
        try {
            if (value.length) {
                const valueString = value.replaceAll(".", "").replaceAll(",", "")
                valueFinal = parseInt(valueString)
            }
            if (quantity.length) {
                quantityFinal = parseInt(quantity)
            }
        } catch (err) {
            console.error(err)
        }
        const total = valueFinal * quantityFinal
        setValueTotal(handleMountNumberCurrency(total.toString(), ".", ",", 3, 2))
        handlePutPayment(total)
    }

    const handleValidadeTarget = (immobile) => {
        let canAdd = true
        props.services[index].immobilesOrigin.map((element, index) => {
            if (immobile.id === element.id) {
                canAdd = false
            }
        })
        return canAdd
    }

    const handleValidadeOrigin = (immobile) => {
        let canAdd = true
        props.services[index].immobilesTarget.map((element, index) => {
            if (immobile.id === element.id) {
                canAdd = false
            }
        })
        return canAdd
    }

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
                <FormRowColumn unit="1">
                    <InputTextAutoComplete
                        title="Titulo"
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetServiceTitle}
                        value={props.services[index].title}
                        id={"title-" + index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                        validationMessage="Titulo em branco."
                        sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        title="Valor"
                        mask="currency"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetServiceValue}
                        value={props.services[index].value}
                        id={"value-" + index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        title="Quantidade"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isForDisable}
                        onSetText={handleSetServiceQuantity}
                        value={props.services[index].quantity}
                        onValidate={handleChangeFormValidation}
                        id={"quantity-" + index + "-" + props.id}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        isDisabled
                        title="Total"
                        mask="currency"
                        value={valueTotal}
                        validation={NUMBER_MARK}
                        onSetText={setValueTotal}
                        isLoading={props.isLoading}
                        id={"total-" + index + "-" + props.id}
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
                        <FormRowColumn unit="2">
                            <InputText
                                mask="date"
                                maxLength={10}
                                title="Prazo final"
                                isLoading={props.isLoading}
                                isDisabled={props.isForDisable}
                                onSetText={handleSetServiceDate}
                                onValidate={handleChangeFormValidation}
                                id={"date-due-" + index + "-" + props.id}
                                value={props.services[index].dateString}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                id="status"
                                isDisabled={true}
                                value={props.services[index].status}
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
                                onSetText={handleSetServiceDescription}
                                id={"description-" + index + "-" + props.id}
                                value={props.services[index].description}
                            />
                        </FormRowColumn>
                    </FormRow>

                </>
            </ScrollDownTransition>

            <ScrollDownTransition
                isOpen={isFormOpen}>
                <SelectProfessionalForm
                    title="Profissional"
                    formClassName="p-1 m-2"
                    isMultipleSelect={false}
                    isLoading={props.isLoading}
                    professionals={professionals}
                    subtitle="Adicione o profissional"
                    onShowMessage={props.onShowMessage}
                    buttonTitle="Adicionar profissional"
                    onSetProfessionals={handleSetServiceProfessional}
                    validationMessage="Esta pessoa já é um profissional"
                />

                <SelectImmobileForm
                    title="Imóveis alvo"
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    buttonTitle="Adicionar imóveis"
                    subtitle="Selecione os imovéis"
                    onValidate={handleValidadeTarget}
                    onShowMessage={props.onShowMessage}
                    onSetImmobiles={handleSetServiceImmobilesTarget}
                    immobiles={props.services[index].immobilesTarget}
                    isMultipleSelect={props.services[index].immobilesOrigin?.length < 2}
                    validationMessage="Este imóvel alvo já está selecionado"
                />

                {props.services[index].immobilesTarget?.length > 0 && (
                    <SelectImmobileForm
                        formClassName="p-1 m-2"
                        title="Imóveis de origem"
                        isLoading={props.isLoading}
                        buttonTitle="Adicionar imóveis"
                        subtitle="Selecione os imovéis"
                        onValidate={handleValidadeOrigin}
                        onShowMessage={props.onShowMessage}
                        onSetImmobiles={handleSetServiceImmobilesOrigin}
                        immobiles={props.services[index].immobilesOrigin}
                        validationMessage="Este imóvel de origem já está selecionado"
                        isMultipleSelect={props.services[index].immobilesTarget?.length < 2}
                    />
                )}

                <ServiceStageForm
                    title="Etapas"
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    subtitle="Adicione as etapas"
                    onShowMessage={props.onShowMessage}
                    onSetServiceStages={handleSetServiceStages}
                    serviceStages={props.services[index].serviceStages}
                />

                <ServicePaymentForm
                    title="Pagamento"
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    subtitle="Adicione os pagamentos"
                    servicePayments={servicePayments}
                    onShowMessage={props.onShowMessage}
                    onSetServicePayments={handleSetServicePayments}
                />
            </ScrollDownTransition>
            {/*
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
                            */}

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">Deseja realmente deletar {props.services[index].title}?</p>
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