import Form from "./form";
import FormRow from "./formRow";
import { useState } from "react";
import FormRowColumn from "./formRowColumn";
import InputText from "../inputText/inputText";
import { defaultUser, User } from "../../interfaces/objectInterfaces";
import InputSelectPerson from "../inputText/inputSelectPerson";
import { EMAIL_MARK, NOT_NULL_MARK } from "../../util/patternValidationUtil";
import InputCheckbox from "../inputText/inputCheckbox";
import InputSelect from "../inputText/inputSelect";
import { NavBarPath } from "../bar/navBar";

interface UserDataFormProps {
    title?: string,
    subtitle?: string,
    index?: number,
    isPrint?: boolean,
    isProfile?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    user?: User,
    prevPath?: NavBarPath[] | any,
    onBlur?: (any) => void,
    onShowMessage?: (any) => void,
    onSet?: (any, number?) => void,
}

export const handleCheckUsername = async (username, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isUsernameAvaliable/" + username + "/" + id).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export const handleCheckUserEmail = async (email, id) => {
    let res = { data: false }
    try {
        res = await fetch("api/isUserEmailAvaliable/" + email + "/" + id).then(res => res.json())
    } catch (err) {
        console.error(err)
    }
    return res
}

export default function UserDataForm(props: UserDataFormProps) {
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isCheckingEmail, setIsCheckingEmail] = useState(false)
    const [isUserNameInvalid, setIsUserNameInvalid] = useState(false)
    const [isCheckingUserName, setIsCheckingUserName] = useState(false)
    const [isFormValid, setIsFormValid] = useState(true)

    const handleSetEmail = (value) => { handleSet({ ...props.user, email: value }) }
    const handleSetOffice = (value) => { handleSet({ ...props.user, office: value }) }
    const handleSetPerson = (value) => { handleSet({ ...props.user, person: value }) }
    const handleSetPassword = (value) => { handleSet({ ...props.user, password: value }) }
    const handleSetUsername = (value) => { handleSet({ ...props.user, username: value }) }
    const handleSetIsBlocked = (value) => { handleSet({ ...props.user, isBlocked: value }) }
    const handleSetPasswordConfirm = (value) => { handleSet({ ...props.user, passwordConfirm: value }) }

    const handleValidEmail = async (event, show?) => {
        if (event && event.relatedTarget?.tagName?.toLowerCase() !== ("input" || "select" || "textarea")) {
            return
        }
        if (false && isCheckingEmail) {
            return
        }
        if (props.user.email?.length > 0) {
            if (!show) {
                setIsCheckingEmail(true)
            }
            let res = await handleCheckUserEmail(props.user.email, props.user.id)
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
        if (props.user.username?.length > 0) {
            if (!show) {
                setIsCheckingUserName(true)
            }
            let res = await handleCheckUsername(props.user.username, props.user.id)
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

    const handleSet = (value: User) => {
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
            {!props.isProfile && (
                <FormRow>
                    <FormRowColumn unit="6">
                        <InputCheckbox
                            title="bloqueado?"
                            id="user-is-blocked"
                            isLoading={props.isLoading}
                            value={props.user.isBlocked}
                            isDisabled={props.isDisabled}
                            onSetText={handleSetIsBlocked}
                        />
                    </FormRowColumn>
                </FormRow>
            )}
            <FormRow>
                <FormRowColumn unit="6">
                    <InputText
                        id="user-name"
                        title="Username"
                        isLoading={props.isLoading}
                        value={props.user.username}
                        onBlur={(event) => {
                            handleValidUsername(event)
                        }}
                        validation={NOT_NULL_MARK}
                        isInvalid={isUserNameInvalid}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetUsername}
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
                        value={props.user.email}
                        isLoading={props.isLoading}
                        validation={EMAIL_MARK}
                        isInvalid={isEmailInvalid}
                        onSetText={handleSetEmail}
                        isDisabled={props.isDisabled}
                        message="Verificando o e-mail..."
                        isForShowMessage={isCheckingEmail}
                        onValidate={handleChangeFormValidation}
                        validationMessage="O e-mail não pode ficar em branco, ou inválido."
                        onBlur={(event) => {
                            handleValidEmail(event)
                        }}
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <InputSelect
                        title="Cargo"
                        id="user-office"
                        value={props.user.office}
                        isLoading={props.isLoading}
                        onSetText={handleSetOffice}
                        isDisabled={props.isDisabled}
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
                        isLoading={props.isLoading}
                        value={props.user.password}
                        isDisabled={props.isDisabled}
                        onSetText={handleSetPassword}
                        onValidate={handleChangeFormValidation}
                        validationMessage="A senha não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <InputText
                        type="password"
                        title="Confirme a senha"
                        id="user-password-confirm"
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        value={props.user.passwordConfirm}
                        onSetText={handleSetPasswordConfirm}
                        onValidate={handleChangeFormValidation}
                        validationMessage="A senha não pode ficar em branco."
                    />
                </FormRowColumn>
            </FormRow>
            {!props.isProfile && (
                <FormRow>
                    <FormRowColumn unit="6" className="">
                        <InputSelectPerson
                            title="Pessoa"
                            onBlur={props.onBlur}
                            onSet={handleSetPerson}
                            prevPath={props.prevPath}
                            isLoading={props.isLoading}
                            isDisabled={props.isDisabled}
                            value={props.user?.person?.name}
                            id={"user-person" + (props.index ? "-" + props.index : "")}
                        />
                    </FormRowColumn>
                </FormRow>
            )}
        </Form>
    )
}
