import { useState } from "react";
import FormRow from "../form/formRow";
import Button from "../button/button";
import InputText from "../inputText/inputText";
import WindowModal from "../modal/windowModal";
import FormRowColumn from "../form/formRowColumn";
import ServiceStageForm from "./serviceStageForm";
import ServicePaymentForm from "./servicePaymentForm";
import InputTextArea from "../inputText/inputTextArea";
import SelectImmobileForm from "../select/selectImmobileForm";
import ScrollDownTransition from "../animation/scrollDownTransition";
import SelectProfessionalForm from "../select/selectProfessionalForm";
import InputTextAutoComplete from "../inputText/inputTextAutocomplete";
import { NOT_NULL_MARK, NUMBER_MARK } from "../../util/patternValidationUtil";
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils";
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/outline";
import { handleMountNumberCurrency, handleValueStringToFloat } from "../../util/maskUtil";
import { defaultServicePayment, Service, ServicePayment } from "../../interfaces/objectInterfaces";

interface ServiceDataFormProps {
    id?: string,
    title?: string,
    subtitle?: string,
    status?: "ORÇAMENTO" | "NORMAL" | "ARQUIVADO" | "FINALIZADO" | "PENDENTE",
    index?: number,
    isBack?: boolean,
    isSingle?: boolean,
    isSelect?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isForShowAll?: boolean,
    service?: Service,
    onBlur?: (any) => void,
    onDelete?: (number) => void,
    onFinishAdd?: (any?) => void,
    onSet?: (any, number?) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ServiceDataForm(props: ServiceDataFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(props?.isSingle ? true : false)
    const [isFormValid, setIsFormValid] = useState(false)

    const [professionals, setProfessionals] = useState((props.service?.professional && "id" in props.service?.professional
        && props.service.professional.id.length) ? [props.service.professional] : [])

    const handleSetServiceTitle = (value) => { handleSet({ ...props.service, title: value }) }
    const handleSetServiceDate = (value) => { handleSet({ ...props.service, dateString: value }) }
    const handleSetServiceStages = (value) => { handleSet({ ...props.service, serviceStages: value }) }
    const handleSetServiceDescription = (value) => { handleSet({ ...props.service, description: value }) }
    const handleSetServiceImmobilesTarget = (value) => { handleSet({ ...props.service, immobilesTarget: value }) }
    const handleSetServiceImmobilesOrigin = (value) => { handleSet({ ...props.service, immobilesOrigin: value }) }
    const handleSetServicePayments = (value) => { handleSet({ ...props.service, servicePayments: value }) }

    const handleSetServiceProfessional = (value) => {
        setProfessionals(value)
        handleSet({ ...props.service, professional: value[0] })
    }

    const handleSetServiceValue = (value) => {
        const total = handleCalculateTotal(value, props.service.quantity)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        const list = handlePutPayment(total)
        handleSet({ ...props.service, value: value, servicePayments: list, total: totalFormated })
    }

    const handleSetServiceQuantity = (value) => {
        const total = handleCalculateTotal(props.service.value, value)
        const totalFormated = handleMountNumberCurrency(total.toString(), ".", ",", 3, 2)
        const list = handlePutPayment(total)
        handleSet({ ...props.service, quantity: value, servicePayments: list, total: totalFormated })
    }

    const handleCalculateTotal = (value: string, quantity: string) => {
        let valueFinal = 0
        let quantityFinal = 0
        try {
            if (value.length) {
                /*
                const valueString = handleValueStringToFloat(value)
                valueFinal = parseInt(valueString)
                */
                valueFinal = handleValueStringToFloat(value)
            }
            if (quantity.length) {
                quantityFinal = parseInt(quantity)
            }
        } catch (err) {
            console.error(err)
        }
        const v = (valueFinal * quantityFinal).toFixed(2)
        return v
    }

    const handleUpdateValueByPayments = (value, i) => {
        let unit
        let valueFinal = 0
        let quantityFinal = 0
        let servicePayments = []
        try {
            const service = props.service
            servicePayments = service.servicePayments
            servicePayments?.map((element: ServicePayment, ii) => {
                if (ii !== i) {
                    valueFinal = valueFinal + handleValueStringToFloat(element?.value)
                } else {
                    valueFinal = valueFinal + handleValueStringToFloat(value)
                }
            })
            quantityFinal = parseInt(service.quantity)
            unit = (valueFinal / quantityFinal).toFixed(2)
            servicePayments = [
                ...servicePayments.slice(0, i),
                {
                    ...servicePayments[i],
                    value: handleMountNumberCurrency(value.toString(), ".", ",", 3, 2)
                },
                ...servicePayments.slice(i + 1, servicePayments.length),
            ]
        } catch (err) {
            console.error(err)
        }
        handleSet({
            ...props.service,
            servicePayments: servicePayments,
            value: handleMountNumberCurrency(unit.toString(), ".", ",", 3, 2),
            total: handleMountNumberCurrency(valueFinal.toFixed(2).toString(), ".", ",", 3, 2),
        })
    }

    const handlePutPayment = (valueTotal) => {
        if (valueTotal > -1) {
            const actualList = props.service.servicePayments
            if (actualList.length && actualList.length > 0) {
                let returnList = []
                const value = (valueTotal / actualList.length).toFixed(2)
                actualList.map((element, index) => {
                    returnList = [...returnList, { ...element, value: handleMountNumberCurrency(value.toString(), ".", ",", 3, 2) }]
                })
                return returnList
            } else {
                return [
                    {
                        ...defaultServicePayment,
                        index: 0,
                        description: "Entrada",
                        dateString: handleUTCToDateShow((handleNewDateToUTC() + 2592000000) + ""),
                        value: handleMountNumberCurrency(((valueTotal / 2).toFixed(2)).toString(), ".", ",", 3, 2),
                    },
                    {
                        ...defaultServicePayment,
                        index: 1,
                        description: "Entrega",
                        dateString: handleUTCToDateShow((handleNewDateToUTC() + (2592000000 * 2)) + ""),
                        value: handleMountNumberCurrency(((valueTotal / 2).toFixed(2)).toString(), ".", ",", 3, 2),
                    },
                ]
            }
        }
    }

    const handleValidadeTargetForAddButton = () => {
        let canAdd = true
        try {
            const targetLenght = props.service.immobilesTarget?.length ?? 0
            const originLenght = props.service.immobilesOrigin?.length ?? 0
            canAdd = targetLenght > 0 && originLenght > 1
        } catch (err) {
            console.error(err)
        }
        return canAdd
    }

    const handleValidadeTarget = (immobile) => {
        let canAdd = true
        props.service?.immobilesOrigin?.map((element, index) => {
            if (immobile.id === element.id) {
                canAdd = false
            }
        })
        return canAdd
    }

    const handleValidadeOriginForAddButton = () => {
        let canAdd = true
        try {
            const targetLenght = props.service.immobilesTarget?.length ?? 0
            const originLenght = props.service.immobilesOrigin?.length ?? 0
            canAdd = originLenght > 0 && targetLenght > 1
        } catch (err) {
            console.error(err)
        }
        return canAdd
    }

    const handleValidadeOrigin = (immobile) => {
        let canAdd = true
        props.service.immobilesTarget.map((element, index) => {
            if (immobile.id === element.id) {
                canAdd = false
            }
        })
        return canAdd
    }

    const handleSet = (element) => {
        if (props.onSet) {
            if (props.index > -1) {
                props.onSet(element, props.index)
            } else {
                props.onSet(element)
            }
        }
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowButton = () => {
        return (
            <>
                {props.isForShowAll && (
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
                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <div className="hidden sm:block mr-2 sm:mt-auto">
                        {handleShowButton()}
                    </div>

                    <InputTextAutoComplete
                        title="Titulo"
                        onBlur={props.onBlur}
                        validation={NOT_NULL_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServiceTitle}
                        value={props.service.title}
                        validationMessage="Titulo em branco."
                        onValidate={handleChangeFormValidation}
                        id={"title-service-" + props.index + "-" + props.id}
                        sugestions={["Ambiental", "Desmembramento", "Georeferenciamento", "União", "Licenciamento"]}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        title="Valor"
                        mask="currency"
                        onBlur={props.onBlur}
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServiceValue}
                        value={props.service.value}
                        id={"value-service-" + props.index + "-" + props.id}
                        onValidate={handleChangeFormValidation}
                    />
                </FormRowColumn>
                <FormRowColumn unit="1">
                    <InputText
                        title="Quantidade"
                        onBlur={props.onBlur}
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetServiceQuantity}
                        value={props.service.quantity}
                        onValidate={handleChangeFormValidation}
                        id={"quantity-service-" + props.index + "-" + props.id}
                    />
                </FormRowColumn>
                <FormRowColumn unit="2" className="flex flex-col sm:flex-row">
                    <InputText
                        isDisabled
                        title="Total"
                        mask="currency"
                        validation={NUMBER_MARK}
                        isLoading={props.isLoading}
                        value={props.service.total}
                        id={"total-service-" + props.index + "-" + props.id}
                    />
                    {!props.isSingle && !props.isDisabled && props.onDelete && (
                        <Button
                            color="red"
                            isLoading={props.isLoading}
                            className="mt-2 sm:mt-0 ml-2 h-fit self-end"
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
                                mask="date"
                                title="Prazo"
                                maxLength={10}
                                onBlur={props.onBlur}
                                isLoading={props.isLoading}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetServiceDate}
                                onValidate={handleChangeFormValidation}
                                id={"date-due-service-" + props.index + "-" + props.id}
                                value={props.service.dateString}
                            />
                        </FormRowColumn>

                        <FormRowColumn unit="2">
                            <InputText
                                title="Status"
                                isDisabled={true}
                                id="status-service"
                                value={props.service.status}
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
                                onSetText={handleSetServiceDescription}
                                id={"description-service-" + props.index + "-" + props.id}
                                value={props.service.description}
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
                    isLocked={props.isDisabled}
                    subtitle="Adicione o profissional"
                    onShowMessage={props.onShowMessage}
                    buttonTitle="Adicionar profissional"
                    validationButton={professionals.length === 1}
                    onSetProfessionals={handleSetServiceProfessional}
                    validationMessage="Esta pessoa já é um profissional"
                    validationMessageButton="Você não pode mais adicionar profissionais"
                    onFinishAdd={() => {
                        {/*
                        if (props.onFinishAdd) {
                            props.onFinishAdd()
                        }
                    */}
                    }}
                />

                <SelectImmobileForm
                    title="Imóveis alvo"
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    isLocked={props.isDisabled}
                    buttonTitle="Adicionar imóveis"
                    subtitle="Selecione os imovéis"
                    onValidate={handleValidadeTarget}
                    onShowMessage={props.onShowMessage}
                    onSetImmobiles={handleSetServiceImmobilesTarget}
                    immobiles={props.service.immobilesTarget}
                    validationMessageButton="Não é possivel adicionar"
                    validationButton={handleValidadeTargetForAddButton()}
                    validationMessage="Este imóvel alvo já está selecionado"
                    isMultipleSelect={props.service.immobilesOrigin?.length < 2}
                    onFinishAdd={() => {
                        {/*
                        if (props.onFinishAdd) {
                            props.onFinishAdd()
                        }
                    */}
                    }}
                />

                {props.service.immobilesTarget?.length > 0 && (
                    <SelectImmobileForm
                        formClassName="p-1 m-2"
                        title="Imóveis de origem"
                        isLoading={props.isLoading}
                        isLocked={props.isDisabled}
                        buttonTitle="Adicionar imóveis"
                        subtitle="Selecione os imovéis"
                        onValidate={handleValidadeOrigin}
                        onShowMessage={props.onShowMessage}
                        onSetImmobiles={handleSetServiceImmobilesOrigin}
                        immobiles={props.service.immobilesOrigin}
                        validationMessageButton="Não é possivel adicionar"
                        validationButton={handleValidadeOriginForAddButton()}
                        validationMessage="Este imóvel de origem já está selecionado"
                        isMultipleSelect={props.service.immobilesTarget?.length < 2}
                        onFinishAdd={() => {
                            {/*
                            if (props.onFinishAdd) {
                                props.onFinishAdd()
                            }
                        */}
                        }}
                    />
                )}

                <ServiceStageForm
                    title="Etapas"
                    status={props.status}
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    subtitle="Adicione as etapas"
                    isDisabled={props.isDisabled}
                    onShowMessage={props.onShowMessage}
                    onSetServiceStages={handleSetServiceStages}
                    id={"service-stages-" + props.service.id}
                    serviceStages={props.service.serviceStages}
                />

                <ServicePaymentForm
                    title="Pagamento"
                    status={props.status}
                    formClassName="p-1 m-2"
                    isLoading={props.isLoading}
                    isDisabled={props.isDisabled}
                    subtitle="Adicione os pagamentos"
                    onShowMessage={props.onShowMessage}
                    onSetServicePayments={handleSetServicePayments}
                    onUpdateServiceValue={handleUpdateValueByPayments}
                    id={"service-payments-" + props.service.id}
                    servicePayments={props.service.servicePayments}
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
                            isDisabled={props.isDisabled}
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
                <p className="text-center">Deseja realmente deletar {props.service.title}?</p>
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