import { NavBarPath } from "../bar/navBar"
import UserDataForm from "../form/userDataForm"
import PersonDataForm from "../form/personDataForm"
import PlaceholderForm from "../form/placeholderForm"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/authContext"
import ProfileActionBarForm from "../bar/profileActionBar"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { User, defaultUser, defaultPerson } from "../../interfaces/objectInterfaces"
import { handleMaskCPF } from "../../util/maskUtil"

interface ProfilePageProps {
    id?: string,
    userId?: string,
    getInfo?: boolean,
    canSave?: boolean,
    canDelete?: boolean,
    canUpdate?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    prevPath?: NavBarPath[],
    onSetPage?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function ProfilePage(props: ProfilePageProps) {
    const { user } = useContext(AuthContext)
    const [isFirst, setIsFirst] = useState(user.id?.length > 0)
    const [userProfile, setUserProfile] = useState<User>(defaultUser)
    const [person, setPerson] = useState<User>(defaultPerson)

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    const handleSetIsLoading = (value) => {
        if (props.onSetIsLoading) {
            props.onSetIsLoading(value)
        }
    }

    const handleSetPage = (value) => {
        if (props.onSetPage) {
            props.onSetPage(value)
        }
    }

    useEffect(() => {
        if (isFirst && user?.id?.length > 0) {
            fetch("api/user/" + user.id).then((res) => res.json()).then((res) => {
                setIsFirst(false)
                const localUser: User = {
                    ...res?.data,
                    passwordConfirm: res?.data?.password,
                }
                setUserProfile(localUser)
                if (localUser.person?.name?.length > 0) {
                    setPerson({
                        ...localUser.person, cpf: handleMaskCPF(localUser.person?.cpf)
                    })
                }
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            {userProfile.id?.length > 0 ? (
                <>
                    <ProfileActionBarForm
                        person={person}
                        user={userProfile}
                        onSetPerson={setPerson}
                        onSetUser={setUserProfile}
                        isLoading={props.isLoading}
                        onShowMessage={handleShowMessage}
                        onSetIsLoading={handleSetIsLoading}
                        onAfterSave={() => {
                            handleSetPage("DASHBOARD")
                        }}
                    />
                    <UserDataForm
                        isProfile
                        user={userProfile}
                        onSet={setUserProfile}
                        title="Dados do usuário"
                        isLoading={props.isLoading}
                        subtitle="Informe os dados do usuário"
                    />
                    <PersonDataForm
                        isProfile
                        person={person}
                        onSet={setPerson}
                        title="Dados pessoais"
                        isLoading={props.isLoading}
                        subtitle="Informe os dados pessoais"
                    />
                </>
            ) : (
                <PlaceholderForm />
            )}
        </>
    )
}
