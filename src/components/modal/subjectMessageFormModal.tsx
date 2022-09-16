import Button from '../button/button'
import WindowModal from './windowModal'
import { useEffect, useState } from 'react'
import { FeedbackMessage } from './feedbackMessageModal'
import SubjectMessageForm from '../form/subjectMessageForm'
import SubjectMessageView from '../view/subjectMessageView'
import PlaceholderItemList from '../list/placeholderItemList'
import SubjectMessageLayoutModal from './subjectMessageLayoutModal'
import { defaultSubjectMessage, SubjectMessage } from '../../interfaces/objectInterfaces'

interface SubjectMessageFormModalProps {
    title?: string,
    children?: any,
    subjectMessage?: SubjectMessage,
    isOpen?: boolean,
    setIsOpen?: (boolean) => void,
    onShowMessage?: (FeedbackMessage) => void,
}

export default function SubjectMessageFormModal(props: SubjectMessageFormModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [subjectMessage, setSubjectMessage] = useState<SubjectMessage>(defaultSubjectMessage)
    const [subjectMessages, setSubjectMessages] = useState<SubjectMessage[]>([])

    const handleAfterSave = (feedbackMessage, subjectMessage) => {
        setSubjectMessages([subjectMessage, ...subjectMessages])
    }

    const handleDeleteClick = async (subjectMessage) => {
        setIsLoading(true)
        let feedbackMessage: FeedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        const res = await fetch("api/subjectMessage", {
            method: "DELETE",
            body: JSON.stringify({ token: "tokenbemseguro", id: subjectMessage.id }),
        }).then((res) => res.json())
        if (res.status === "SUCCESS") {
            feedbackMessage = { messages: ["Removido com sucesso!"], messageType: "SUCCESS" }
        } else {
            feedbackMessage = { messages: ["Algo deu errado"], messageType: "ERROR" }
        }
        const index = subjectMessages.indexOf(subjectMessage)
        const list = [
            ...subjectMessages.slice(0, index),
            ...subjectMessages.slice(index + 1, subjectMessages.length),
        ]
        setSubjectMessage(defaultSubjectMessage)
        setSubjectMessages(list)
        setIsLoading(false)
        setIsOpen(false)
        if (props.onShowMessage) {
            props.onShowMessage(feedbackMessage)
        }
    }

    useEffect(() => {
        if (props.isOpen && isFirst && props?.subjectMessage?.referenceBase?.length && props?.subjectMessage?.referenceId?.length) {
            fetch("../api/subjectMessages/" + props.subjectMessage.referenceBase + "/" + props.subjectMessage.referenceId).then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.list.length) {
                    setSubjectMessages(res.list)
                }
                setIsLoading(false)
            })
        }
    })

    return (
        <>
            <SubjectMessageLayoutModal isOpen={props.isOpen} setIsOpen={props.setIsOpen} >
                <SubjectMessageForm
                    isMultiple
                    haveActionButtons
                    className="pt-10 sm:pt-28"
                    onAfterSave={handleAfterSave}
                    subjectMessage={props.subjectMessage} />
                <div className="mt-4">
                    {isLoading ? (
                        <PlaceholderItemList />
                    ) : (
                        <>
                            {subjectMessages.map((element, index) => (
                                <SubjectMessageView
                                    title=""
                                    onDelete={(event) => {
                                        //setIsOpen(true)
                                        //setSubjectMessage(element)
                                        handleDeleteClick(element)
                                    }}
                                    hidePaddingMargin
                                    elementId={element.id}
                                    key={element.id + index}
                                    classNameContentHolder="gap-0"
                                    classNameHolder="px-4 py-2 my-2"
                                />
                            ))}
                        </>
                    )}
                </div>
            </SubjectMessageLayoutModal>

            <WindowModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <p className="text-center">{"Você quer realmente excluir o comentário?"}</p>
                <div className="flex mt-10 justify-between content-between">
                    <Button
                        onClick={() => setIsOpen(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        color="red"
                        onClick={(event) => {
                            handleDeleteClick(subjectMessage)
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            </WindowModal>
        </>
    )
}