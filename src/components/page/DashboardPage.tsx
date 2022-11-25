import { useContext } from "react"
import { AuthContext } from "../../contexts/authContext"
import FormRow from "../form/formRow"
import FormRowColumn from "../form/formRowColumn"
import { FeedbackMessage } from "../modal/feedbackMessageModal"
import ServicePage from "./ServicePage"
import ServiceStagePage from "./ServiceStagePage"

interface DashboardPageProps {
    id?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    isStatusDisabled?: boolean,
    onSetPage?: (any) => void,
    onSetCheck?: (any) => void,
    onSetIsLoading?: (any) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function DashboardPage(props: DashboardPageProps) {
    const { user } = useContext(AuthContext)

    const handleOnShowMessage = (value) => {
        if (props.onShowMessage) {
            props.onShowMessage(value)
        }
    }

    const handleSetCheckPendency = (value) => {
        if (props.onSetCheck) {
            props.onSetCheck(value)
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

    return (
        <div className="flex flex-row justify-between">
            <div className="w-full pr-2">
                <ServicePage
                    getInfo
                    userId={user.id}
                    onSetPage={handleSetPage}
                    isLoading={props.isLoading}
                    onSetIsLoading={handleSetIsLoading}
                    onSetCheck={handleSetCheckPendency}
                    onShowMessage={handleOnShowMessage}
                />
            </div>
            <div className="w-full pl-2">
                <ServiceStagePage
                    getInfo
                    userId={user.id}
                    onSetPage={handleSetPage}
                    isLoading={props.isLoading}
                    onSetIsLoading={handleSetIsLoading}
                    onSetCheck={handleSetCheckPendency}
                    onShowMessage={handleOnShowMessage}
                />
            </div>
        </div>
    )
}
