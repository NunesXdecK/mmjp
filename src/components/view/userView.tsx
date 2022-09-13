import InfoView from "./infoView"
import Button from "../button/button"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import ScrollDownTransition from "../animation/scrollDownTransition"
import { defaultUser, User } from "../../interfaces/objectInterfaces"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline"

interface UserViewProps {
    id?: string,
    title?: string,
    elementId?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
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
            if (props.elementId && props.elementId.length !== 0 && user.id?.length === 0) {
                fetch("api/user/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setUser(res.data)
                })
            }
        }
    })

    return (
        <>
            {user.id?.length === 0 ? (
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
                                {props.canShowHideData && props.hideData && hasHideData && (
                                    <Button
                                        isLight
                                        className="bg-transparent mr-2 sm:mt-auto"
                                        onClick={() => {
                                            setIsShowInfo(!isShowInfo)
                                        }}
                                    >
                                        {isShowInfo ? (
                                            <ChevronDownIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <ChevronRightIcon className="text-gray-600 block h-5 w-5" aria-hidden="true" />
                                        )}
                                    </Button>
                                )}
                                {user.isBlocked && (
                                    <InfoView classNameHolder="w-full" classNameInfo="rounded-md px-3 py-1 bg-red-600 text-white" info="BLOQUEADO" />
                                )}
                                <InfoView title="Titulo" info={user.username} />
                                <InfoView title="E-mail" info={user.email} />
                                <ScrollDownTransition isOpen={isShowInfo}>
                                    <InfoHolderView
                                        hideBorder
                                        hidePaddingMargin
                                    >
                                        <InfoView title="Cargo" info={user.office} />
                                        {user.dateInsertUTC > 0 && <InfoView title="Data inserção" info={handleUTCToDateShow(user.dateInsertUTC.toString())} />}
                                        {user.dateLastUpdateUTC > 0 && <InfoView title="Data atualização" info={handleUTCToDateShow(user.dateLastUpdateUTC.toString())} />}
                                        {props.dataInside && handlePutData()}
                                    </InfoHolderView>
                                </ScrollDownTransition>
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
