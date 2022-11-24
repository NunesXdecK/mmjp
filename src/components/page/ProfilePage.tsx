import { NavBarPath } from "../bar/navBar"
import UserDataForm from "../form/userDataForm"
import UserActionBarForm from "../bar/userActionBar"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/authContext"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import { User, defaultUser } from "../../interfaces/objectInterfaces"
import PlaceholderForm from "../form/placeholderForm"

interface ProfilePageProps {
    id?: string,
    userId?: string,
    getInfo?: boolean,
    canSave?: boolean,
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
                handleSetIsLoading(false)
            })
        }
    })

    return (
        <>
            {userProfile.id?.length > 0 ? (
                <>
                    <UserActionBarForm
                        user={userProfile}
                        onSet={setUserProfile}
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
                        isLoading={props.isLoading}
                    />
                </>
            ) : (
                <PlaceholderForm />
            )}
        </>
    )
}
