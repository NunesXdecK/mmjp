import Head from "next/head"
import { useEffect, useState } from "react"
import Form from "../components/form/form"
import Button from "../components/button/button"
import Layout from "../components/layout/layout"
import { ChatAltIcon } from "@heroicons/react/solid"
import { PERSON_COLLECTION_NAME } from "../db/firebaseDB"
import FeedbackPendency from "../components/modal/feedbackPendencyModal"
import SubjectMessageFormModal from "../components/modal/subjectMessageFormModal"
import { defaultSubjectMessage, SubjectMessage } from "../interfaces/objectInterfaces"
import FeedbackMessageModal, { defaultFeedbackMessage, FeedbackMessage } from "../components/modal/feedbackMessageModal"

export default function Index() {
    const [isFirst, setIsFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
    const [messages, setMessages] = useState<string[]>([])

    const [subjectMessage, setSubjectMessage] = useState<SubjectMessage>({
        ...defaultSubjectMessage,
        referenceId: "M8Kvcag59gggzvesKOV2",
        user: { id: "mj89plpPDa8Tl0f93Pvo" },
        referenceBase: PERSON_COLLECTION_NAME,
    })

    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage>(defaultFeedbackMessage)

    const handleShowMessage = (feedbackMessage: FeedbackMessage) => {
        if (isFeedbackOpen === false) {
            setFeedbackMessage(feedbackMessage)
            setIsFeedbackOpen((isFeedbackOpen) => true)
            setTimeout(() => setIsFeedbackOpen((isFeedbackOpen) => false), 2000)
        }
    }

    useEffect(() => {
        if (isFirst) {
            fetch("api/checkPendencies").then((res) => res.json()).then((res) => {
                setIsFirst(old => false)
                if (res.messages.length) {
                    setMessages(res.messages)
                }
            })
        }
    })

    return (
        <Layout
            title="Testes">
            <Head>
                <title>Testes</title>
                <meta name="description" content="Testes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Form>
                <Button
                    isLight
                    onClick={() => {
                        setIsLoading(!isFeedbackOpen)
                    }}
                >
                    <ChatAltIcon
                        aria-hidden="true"
                        className="block text-indigo-600 h-6 w-6"
                    />
                </Button>
            </Form>

            <SubjectMessageFormModal
                isOpen={isLoading}
                setIsOpen={setIsLoading}
                subjectMessage={subjectMessage}
            />

            <FeedbackPendency messages={messages} />

            <FeedbackMessageModal
                isOpen={isFeedbackOpen}
                feedbackMessage={feedbackMessage}
                setIsOpen={setIsFeedbackOpen}
            />
        </Layout >
    )
}
