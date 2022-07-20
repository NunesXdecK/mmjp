import Form from "../form/form"
import { useState } from "react"
import InputText from "./inputText"
import Button from "../button/button"
import FormRow from "../form/formRow"
import InputTextArea from "./inputTextArea"
import FormRowColumn from "../form/formRowColumn"
import { handleJSONcheck } from "../../util/validationUtil"
import { JSON_MARK } from "../../util/patternValidationUtil"
import { defaultImmobilePoint, ImmobilePoint } from "../../interfaces/objectInterfaces"
import { handleNewDateToUTC, handleUTCToDateShow } from "../../util/dateUtils"

interface InputImmobilePointsProps {
    id?: string,
    title?: string,
    subtitle?: string,
    canTest?: boolean,
    isLoading?: boolean,
    isDisabled?: boolean,
    points?: ImmobilePoint[],
    onSetPoints?: (any) => void,
}

export default function InputImmobilePoints(props: InputImmobilePointsProps) {
    const [text, setText] = useState<string>("")
    console.log(props.points)

    const handleGenerateNumber = () => {
        return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
    }

    const handleCopyTestText = (event) => {
        let array = []
        for (let i = 0; i < 6; i++) {
            const randomPoint: ImmobilePoint = {
                ...defaultImmobilePoint,
                id: "",
                dateInsertUTC: handleNewDateToUTC(),
                description: "PT" + handleGenerateNumber(),
                latitude: handleGenerateNumber().toString(),
                longitude: handleGenerateNumber().toString(),
            }
            array = [...array, randomPoint]
        }
        navigator.clipboard.writeText(JSON.stringify(array))
    }

    const handleChangeText = (event) => {
        const text = event.target.value
        if (handleJSONcheck(text)) {
            const element = JSON.parse(text)
            if (props.onSetPoints) {
                props.onSetPoints(element)
            }
        }
    }

    return (
        <Form
            title={props.title}
            subtitle={props.subtitle}>

            <FormRow>
                <FormRowColumn unit="6">
                    <InputTextArea
                        value={text}
                        onSetText={setText}
                        validation={JSON_MARK}
                        title="Texto dos pontos"
                        onChange={handleChangeText}
                        id={"text-for-points-" + props.id}
                        validationMessage="Formato errado"
                    />
                </FormRowColumn>
            </FormRow>

            {props.canTest && (
                <FormRow>
                    <FormRowColumn unit="6">
                        <Button
                            type="button"
                            isLoading={props.isLoading}
                            isDisabled={props.isLoading}
                            onClick={handleCopyTestText}
                        >
                            Copiar texto de teste
                        </Button>
                    </FormRowColumn>
                </FormRow>
            )}

            {props.points && props.points?.map((element: ImmobilePoint, index) => (
                <div className="mb-2 shadow-md py-2" key={index + element.id + element.description}>
                    <FormRow>
                        <FormRowColumn unit="4">
                            <InputText
                                isDisabled
                                title="Descrição"
                                value={element.description}
                                id={"input-description-" + element.id + element.description}
                            />
                        </FormRowColumn>
                        <FormRowColumn unit="2">
                            <InputText
                                isDisabled
                                title="Data de inserção"
                                value={handleUTCToDateShow(element.dateInsertUTC.toString())}
                                id={"input-inset-date-" + element.id + element.description}
                            />
                        </FormRowColumn>
                    </FormRow>
                    <FormRow>
                        <FormRowColumn unit="3">
                            <InputText
                                isDisabled
                                title="latitude"
                                value={element.latitude}
                                id={"input-latitude-" + element.id + element.description}
                            />
                        </FormRowColumn>
                        <FormRowColumn unit="3">
                            <InputText
                                isDisabled
                                title="Longitude"
                                value={element.longitude}
                                id={"input-longitude-" + element.id + element.description}
                            />
                        </FormRowColumn>
                    </FormRow>
                </div>
            ))}
        </Form>
    )
}
