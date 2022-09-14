import InfoView from "./infoView"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateFullShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { defaultSubjectMessage, SubjectMessage } from "../../interfaces/objectInterfaces"

interface SubjectMessageViewProps {
    id?: string,
    title?: string,
    elementId?: string,
    classNameTitle?: string,
    classNameHolder?: string,
    classNameContentHolder?: string,
    dataInside?: boolean,
    hideBorder?: boolean,
    hidePaddingMargin?: boolean,
    subjectMessage?: SubjectMessage,
}

export default function SubjectMessageView(props: SubjectMessageViewProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [subjectMessage, setSubjectMessage] = useState<SubjectMessage>(props.subjectMessage ?? defaultSubjectMessage)

    const handlePutData = () => {
        return (
            <div className="w-full">
                <PersonView
                    hideData
                    dataInside
                    canShowHideData
                    title={"Dados pessoais"}
                    addressTitle={"Endereço"}
                    person={subjectMessage.user.id}
                />
            </div>
        )
    }

    useEffect(() => {
        if (isFirst) {
            if (props.elementId && props.elementId.length !== 0 && subjectMessage.id?.length === 0) {
                fetch("api/subjectMessage/" + props.elementId).then((res) => res.json()).then((res) => {
                    setIsFirst(old => false)
                    setSubjectMessage(res.data)
                })
            }
        }
    })

    return (
        <>
            {subjectMessage.id?.length === 0 ? (
                <div className="mt-6 text-gray-400">
                    <PlaceholderItemList />
                </div>
            ) : (
                <>
                    <InfoHolderView
                        hideBorder={props.hideBorder}
                        classNameTitle={props.classNameTitle}
                        classNameHolder={props.classNameHolder}
                        hidePaddingMargin={props.hidePaddingMargin}
                        title={props.title ?? "Dados do usuário"}
                        classNameContentHolder={props.classNameContentHolder}
                    >
                        {subjectMessage.user?.username?.length && (
                            <InfoView classNameHolder="w-full text-xl"
                                info={subjectMessage.user?.username} />
                        )}
                        {subjectMessage.dateLastUpdateUTC === 0 &&
                            <InfoView
                                classNameHolder="w-full ml-1 text-gray-500 text-xs italic"
                                info={"Ás " + handleUTCToDateFullShow(subjectMessage.dateInsertUTC.toString())} />}
                        {subjectMessage.dateLastUpdateUTC > 0 &&
                            <InfoView
                                classNameHolder="w-full text-xs italic"
                                info={"Ás " + handleUTCToDateFullShow(subjectMessage.dateLastUpdateUTC.toString())} />}
                        <InfoView classNameHolder="w-full p-2"
                            info={subjectMessage.text} />
                    </InfoHolderView>
                </>
            )}
        </>
    )
}
