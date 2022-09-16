import InfoView from "./infoView"
import PersonView from "./personView"
import { useEffect, useState } from "react"
import InfoHolderView from "./infoHolderView"
import { handleUTCToDateFullShow } from "../../util/dateUtils"
import PlaceholderItemList from "../list/placeholderItemList"
import { defaultSubjectMessage, SubjectMessage } from "../../interfaces/objectInterfaces"
import Button from "../button/button"
import { TrashIcon } from "@heroicons/react/solid"
import ScrollDownTransition from "../animation/scrollDownTransition"

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
    onDelete?: (string?) => void,
}

export default function SubjectMessageView(props: SubjectMessageViewProps) {
    const [isOpen, setIsOpen] = useState(false)
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
                <div className="mt-4">
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
                        <ScrollDownTransition isOpen={isOpen}>
                            <div className="p-4">
                                <p className="text-center">{"Você quer realmente excluir o comentário?"}</p>
                                <div className="flex mt-2 place-content-end gap-1">
                                    <Button
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Não
                                    </Button>
                                    <Button
                                        color="red"
                                        onClick={props.onDelete}
                                    >
                                        Sim
                                    </Button>
                                </div>
                            </div>
                        </ScrollDownTransition>
                        <div className="w-full flex flex-row justify-between">
                            <div>
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
                            </div>
                            <Button
                                isLight
                                onClick={() => {
                                    setIsOpen(!isOpen)
                                }}
                            >
                                <TrashIcon
                                    aria-hidden="true"
                                    className="block text-red-600 h-6 w-6"
                                />
                            </Button>
                        </div>
                        <InfoView classNameHolder="w-full p-2"
                            info={subjectMessage.text} />
                    </InfoHolderView>
                </>
            )}
        </>
    )
}
