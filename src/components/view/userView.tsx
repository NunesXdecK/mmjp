import InfoView from "./infoView"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import SwitchTextButton from "../button/switchTextButton"
import UserStatusButton from "../button/userStatusButton"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultUser, User } from "../../interfaces/objectInterfaces"

interface UserViewProps {
    id?: string,
    title?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    elementId?: number,
    hideData?: boolean,
    dataInside?: boolean,
    hideBorder?: boolean,
    canShowHideData?: boolean,
    hidePaddingMargin?: boolean,
    user?: User,
}

export default function UserView(props: UserViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isShowInfo, setIsShowInfo] = useState(props.hideData ? false : true)
    const [user, setUser] = useState<User>(props.user ?? defaultUser)

    const hasHideData = user.person?.id?.length
    const hasData = hasHideData || user?.username?.length || user?.email?.length

    const handlePutData = () => {
        return (
            <div className="w-full">
                <PersonView
                    hideData
                    dataInside
                    canShowHideData
                    title={"Dados pessoais"}
                    addressTitle={"Endereço"}
                    person={user.person}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId > 0 && user?.id === 0) {
                fetch("api/user/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setUser(res.data)
                })
            }
        }
    })

    return (
        <>
            {user?.id === 0 ? (
                <div className="mt-6">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    {hasData && (
                        <>
                            <InfoHolderView
                                hideBorder={props.hideBorder}
                                classNameTitle={props.classNameTitle}
                                classNameHolder={props.classNameHolder}
                                hidePaddingMargin={props.hidePaddingMargin}
                                title={props.title ?? "Dados do usuário"}
                                classNameContentHolder={props.classNameContentHolder}
                            >
                                {/*
                                {user.isBlocked && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-red-600 text-white">BLOQUEADO</InfoView>
                                )}
                                */}
                                <InfoView title="Username">{user.username}</InfoView>
                                <InfoView title="E-mail">{user.email}</InfoView>
                                <InfoView title="Status">
                                    <UserStatusButton
                                        isDisabled={true}
                                        value={user.isBlocked ? "BLOQUEADO" : "ATIVO"}
                                    />
                                </InfoView>
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoView title="Cargo">{user.office}</InfoView>
                                    {user.dateInsertUTC > 0 && <InfoView title="Data inserção">{handleUTCToDateShow(user.dateInsertUTC.toString())}</InfoView>}
                                    {user.dateLastUpdateUTC > 0 && <InfoView title="Data atualização">{handleUTCToDateShow(user.dateLastUpdateUTC.toString())}</InfoView>}
                                    {props.dataInside && handlePutData()}
                                </ScrollDownTransition>
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <SwitchTextButton
                                        isSwitched={isShowInfo}
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                    </SwitchTextButton>
                                )}
                            </InfoHolderView>
                            <ScrollDownTransition isOpen={isShowInfo}>
                                {!props.dataInside && handlePutData()}
                            </ScrollDownTransition>
                        </>
                    )}
                </>
            )}
        </>
    )
}
