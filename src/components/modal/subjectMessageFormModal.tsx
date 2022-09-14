import { useEffect, useState } from 'react'
import { SubjectMessage } from '../../interfaces/objectInterfaces'
import SubjectMessageForm from '../form/subjectMessageForm'
import PlaceholderItemList from '../list/placeholderItemList'
import SubjectMessageView from '../view/subjectMessageView'
import SubjectMessageLayoutModal from './subjectMessageLayoutModal'

interface SubjectMessageFormModalProps {
    title?: string,
    children?: any,
    subjectMessage?: SubjectMessage,
    isOpen?: boolean,
    setIsOpen?: (boolean) => void,
}

export default function SubjectMessageFormModal(props: SubjectMessageFormModalProps) {
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [subjectMessages, setSubjectMessages] = useState<SubjectMessage[]>([])

    const handleAfterSave = (feedbackMessage, subjectMessage) => {
        setSubjectMessages([subjectMessage, ...subjectMessages])
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
        <SubjectMessageLayoutModal isOpen={props.isOpen} setIsOpen={props.setIsOpen} >
            <SubjectMessageForm
                isMultiple
                haveActionButtons
                className="pt-10 sm:pt-28"
                onAfterSave={handleAfterSave}
                subjectMessage={props.subjectMessage} />

            {isFirst ? (
                <PlaceholderItemList />
            ) : (
                <>
                    {subjectMessages.map((element, index) => (
                        <SubjectMessageView
                            title=""
                            hidePaddingMargin
                            elementId={element.id}
                            key={element.id + index}
                            classNameHolder="px-4 py-2 mb-2"
                            classNameContentHolder="gap-0"
                        />
                    ))}
                </>
            )}
        </SubjectMessageLayoutModal>
    )
}