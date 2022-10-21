import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import InputSelect from "../inputText/inputSelect";
import ActionButtonsForm from "./actionButtonsForm";
import InputCheckbox from "../inputText/inputCheckbox";
import SelectPersonForm from "../select/selectPersonForm";
import { FeedbackMessage } from "../modal/feedbackMessageModal";
import { EMAIL_MARK, NOT_NULL_MARK } from "../../util/patternValidationUtil";
import { handlePrepareUserForDB } from "../../util/converterUtil";
import ScrollDownTransition from "../animation/scrollDownTransition";
import { defaultUser, User } from "../../interfaces/objectInterfaces";
import FeedbackMessageSaveText from "../modal/feedbackMessageSavingText";
import { handleIsEqual, handleUserValidationForDB } from "../../util/validationUtil";

interface UserFormProps {
    title?: string,
    subtitle?: string,
    isBack?: boolean,
    canAutoSave?: boolean,
    canMultiple?: boolean,
    isForSelect?: boolean,
    isDisabled?: boolean,
    isForOldRegister?: boolean,
    user?: User,
    onBack?: (object?) => void,
    onAfterSave?: (object, any?) => void,
    onSelectPerson?: (object) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function UserForm(props: UserFormProps) {
    const [userID, setUserID] = useState(props?.user?.id?.length ? props?.user?.id : "")
    const [user, setUser] = useState<User>(props?.user ?? defaultUser)
    const [userOriginal, setUserOriginal] = useState<User>(props?.user ?? defaultUser)
    const [isFormValid, setIsFormValid] = useState(handleUserValidationForDB(user).validation)

    const [isLoading, setIsLoading] = useState(false)
    const [isMultiple, setIsMultiple] = useState(false)
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isUserNameInvalid, setIsUserNameInvalid] = useState(false)
    const [isCheckingUserName, setIsCheckingUserName] = useState(false)

    const [persons, setPersons] = useState((props?.user?.person && "id" in props?.user?.person && props?.user?.person.id.length) ? [props.user.person] : [])

    const handleSetUserOffice = (value) => { setUser({ ...user, office: value }) }
    const handleSetUserPassword = (value) => { setUser({ ...user, password: value }) }
    const handleSetUserIsBlocked = (value) => { setUser({ ...user, isBlocked: value }) }
    const handleSetUserPasswordConfirm = (value) => { setUser({ ...user, passwordConfirm: value }) }
    const handleSetUserEmail = (value) => {
        setUser({ ...user, email: value })
    }
    const handleSetUserUsername = (value) => {
        setUser({ ...user, username: value })
    }

    const handleOnBack = () => {
        if (props.onBack) {
            props.onBack()
        }
    }

    const handleDiference = (): boolean => {
        let userForValid = { ...user }
        if (persons.length > 0) {
            userForValid = { ...userForValid, person: persons[0] }
        } else {
            userForValid = { ...userForValid, person: {} }
        }
        return !handleIsEqual(userForValid, userOriginal)
    }

    const handleChangeFormValidation = (isValid) => {
        setIsFormValid(isValid)
    }

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleValidEmail = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (false && isCheckingEmail) {
            return
        }
        let email = user.email
        if (email?.length && userOriginal.email !== email) {
            if (!show) {
                setIsCheckingEmail(true)
            }
            let res = await fetch("api/isUserEmailAvaliable/" + email).then(res => res.json())
            if (!show) {
                setIsCheckingEmail(false)
            }
            setIsEmailInvalid(res.data)
            return res.data
        } else {
            setIsCheckingEmail(false)
            return false
        }
    }

    const handleValidUsername = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (false && isCheckingUserName) {
            return
        }
        let username = user.username
        if (username?.length && userOriginal.username !== username) {
            if (!show) {
                setIsCheckingUserName(true)
            }
            let res = await fetch("api/isUsernameAvaliable/" + username).then(res => res.json())
            if (!show) {
                setIsCheckingUserName(false)
            }
            setIsUserNameInvalid(res.data)
            return res.data
        } else {
            setIsCheckingUserName(false)
            return false
        }
    }

    const handleUserValidationForDBInner = (user, isSearchingUN, isSearchingEM) => {
        let isValid = handleUserValidationForDB(user)
        if (user.email.length > 0) {
            if (isSearchingUN) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O e-mail já está em uso."]
                }
            }
        }
        if (user.username.length > 0) {
            if (isSearchingEM) {
                isValid = {
                    ...isValid,
                    validation: false,
                    messages: [...isValid.messages, "O username já está em uso."]
                }
            }
        }
        return isValid
    }

    const handleUserToDB = (user) => {
        let userFinal = { ...user }
        if (persons.length > 0) {
            userFinal = { ...userFinal, person: persons[0] }
        } else {
            userFinal = { ...userFinal, person: {} }
        }
        return userFinal
    }

    const handleAutoSave = async (event?) => {
        if (!props.canAutoSave) {
            return
        }
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (isAutoSaving || isCheckingEmail || isCheckingUserName || isUserNameInvalid || isEmailInvalid) {
            return
        }
        if (!handleDiference()) {
            return
        }
        let userForValid = handleUserToDB(user)
        const isValid = handleUserValidationForDBInner(userForValid, (isCheckingEmail || isCheckingUserName), (isUserNameInvalid || isEmailInvalid))
        if (!isValid.validation) {
            return
        }
        setIsAutoSaving(old => true)
        const res = await handleSaveInner(userForValid, false)
        if (res.status === "ERROR") {
            return
        }
        setIsAutoSaving(old => false)
        setUserID(res.id)
        setUserOriginal(res.user)
    }

    const handlePrepareUserForDBInner = (user) => {
        let userForDB = { ...user }
        if (!userForDB?.id?.length && userID?.length) {
            userForDB = { ...userForDB, id: userID }
        }
        userForDB = handlePrepareUserForDB(userForDB)
        return userForDB
    }

    const handleSaveInner = async (user, history) => {
        let res = { status: "ERROR", id: "", user: user }
        let userForDB = handlePrepareUserForDBInner(user)
        try {
            const saveRes = await fetch("api/user", {
                method: "POST",
                body: JSON.stringify({ token: "tokenbemseguro", data: userForDB, history }),
            }).then((res) => res.json())
            res = { ...res, status: "SUCCESS", id: saveRes.id, user: { ...user, id: saveRes.id } }
        } catch (e) {
            console.error("Error adding document: ", e)
        }
        return res
    }

    const handleSave = async () => {
        if (isAutoSaving) {
            return
        }
        setIsLoading(true)
        let resUN = await handleValidUsername(null, true)
        let resEM = await handleValidEmail(null, true)
        let userForValid = handleUserToDB(user)
        const isValid = handleUserValidationForDBInner(userForValid, resUN, resEM)
        if (!isValid.validation) {
            setIsLoading(false)
            const feedbackMessage: FeedbackMessage = { messages: isValid.messages, messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            return
        }
        let userFromDB = { ...userForValid }
        let res = await handleSaveInner(userForValid, true)
        if (res.status === "ERROR") {
            const feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado!"], messageType: "ERROR" }
            handleShowMessage(feedbackMessage)
            setIsLoading(false)
            return
        }
        setUser({ ...userForValid, id: res.id })
        setUserOriginal({ ...userForValid, id: res.id })
        userFromDB = { ...res.user }
        const feedbackMessage: FeedbackMessage = { messages: ["Sucesso!"], messageType: "SUCCESS" }
        handleShowMessage(feedbackMessage)
        if (isMultiple) {
            setUser(defaultUser)
            setUserOriginal(defaultUser)
            setUserID("")
        }
        if (!isMultiple && props.onAfterSave) {
            props.onAfterSave(feedbackMessage, userFromDB)
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
                isForOpenLeft={user.id !== "" && handleDiference()}
                isForOpenRight={user.id !== "" && handleDiference()}
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
                        <FormRowColumn unit="6">
                            <InputCheckbox
                                title="bloqueado?"
                                id="user-is-blocked"
                                isLoading={isLoading}
                                value={user.isBlocked}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetUserIsBlocked}
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                id="user-name"
                                title="Username"
                                isLoading={isLoading}
                                value={user.username}
                                onBlur={(event) => {
                                    handleValidUsername(event)
                                    handleAutoSave(event)
                                }}
                                validation={NOT_NULL_MARK}
                                isInvalid={isUserNameInvalid}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetUserUsername}
                                message="Verificando o username..."
                                isForShowMessage={isCheckingUserName}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O username não pode ficar em branco, ou inválido."
                            />
                        </FormRowColumn>
                    </FormRow>

                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                title="E-mail"
                                id="user-e-mail"
                                value={user.email}
                                isLoading={isLoading}
                                validation={EMAIL_MARK}
                                isInvalid={isEmailInvalid}
                                onSetText={handleSetUserEmail}
                                isDisabled={props.isDisabled}
                                message="Verificando o e-mail..."
                                isForShowMessage={isCheckingEmail}
                                onValidate={handleChangeFormValidation}
                                validationMessage="O e-mail não pode ficar em branco, ou inválido."
                                onBlur={(event) => {
                                    handleValidEmail(event)
                                    handleAutoSave(event)
                                }}
                            />
                        </FormRowColumn>
                    </FormRow>
                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputSelect
                                title="Cargo"
                                id="user-office"
                                value={user.office}
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetUserOffice}
                                options={["visitante", "secretaria", "projetista", "gerente", "administrador"]}
                            />
                        </FormRowColumn>
                    </FormRow>
                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                title="Senha"
                                type="password"
                                id="user-password"
                                isLoading={isLoading}
                                value={user.password}
                                onBlur={handleAutoSave}
                                isDisabled={props.isDisabled}
                                onSetText={handleSetUserPassword}
                                onValidate={handleChangeFormValidation}
                                validationMessage="A senha não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                    <FormRow>
                        <FormRowColumn unit="6">
                            <InputText
                                type="password"
                                isLoading={isLoading}
                                onBlur={handleAutoSave}
                                title="Confirme a senha"
                                id="user-password-confirm"
                                value={user.passwordConfirm}
                                isDisabled={props.isDisabled}
                                onValidate={handleChangeFormValidation}
                                onSetText={handleSetUserPasswordConfirm}
                                validationMessage="A senha não pode ficar em branco."
                            />
                        </FormRowColumn>
                    </FormRow>
                </Form>
            </form>

            <SelectPersonForm
                persons={persons}
                isLoading={isLoading}
                title="Dados pessoais"
                formClassName="p-1 m-3"
                onSetPersons={setPersons}
                subtitle="Selecione a pessoa"
                buttonTitle="Adicionar pessoa"
                onShowMessage={props.onShowMessage}
                validationButton={persons.length === 1}
                validationMessage="Esta pessoa já está selecionada"
                validationMessageButton="Você não pode mais adicionar pessoas"
            />

            <form
                onSubmit={(event) => {
                    if (event) {
                        event.preventDefault()
                    }
                }}>
                {handleActionBar()}
            </form>
        </>
    )
}