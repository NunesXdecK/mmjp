import { useState } from "react"
import Form from "./form"
import FormRow from "./formRow"
import FormRowColumn from "./formRowColumn"

interface OldDataProps {
    title?: string,
    subtitle?: string,
    oldData?: any,
}

const spanClassTitle = "block text-sm font-medium text-gray-500"
const spanClassData = "text-gray-700"

export function OldDataForm(props: OldDataProps) {

    let values = []
    if (props?.oldData) {
        const keysArray = Object.keys(props.oldData)
        const length = keysArray?.length
        let valuesArray = []
        keysArray.map((element, index) => {
            const value = { name: element, value: props.oldData[element] ?? "" }
            if (valuesArray.length > 0 && valuesArray.length % 3 === 0) {
                values = [...values, valuesArray]
                valuesArray = []
            } else {
                valuesArray = [...valuesArray, value]
            }
        })
    }
    const [valuesToShow, setValuesToShow] = useState(values)

    return (
        <>
            <Form
                title={props.title}
                subtitle={props.subtitle}>
                {valuesToShow.map((element, index) => (
                    <FormRow key={index}>
                        {element.map((elementTwo, indexTwo) => (
                            <FormRowColumn unit="2"  key={indexTwo}>
                                <span
                                    className={spanClassTitle}>
                                    {elementTwo.name + ": "}<span className={spanClassData}>{elementTwo.value}</span>
                                </span>
                            </FormRowColumn>
                        ))}
                    </FormRow>
                ))}

            </Form>
        </>
    )
}
