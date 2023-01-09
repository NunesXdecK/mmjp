import { useState } from "react"

interface InputCVSFileProps {
    id?: string,
    text?: string,
    immobileId?: number,
    isLoading?: boolean,
    isDisabled?: boolean,
    onSet?: (arg0: string) => void,
    onSetPoints?: (arg0: any[]) => void,
}

export default function InputCVSFile(props: InputCVSFileProps) {
    const [text, setText] = useState<string>("")
    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }
    const handleOnSetPoints = (value) => {
        if (props?.immobileId > 0) {
            fetch("api/immobilePoints", {
                method: "POST",
                body: JSON.stringify({
                    data: value,
                    token: "tokenbemseguro",
                    immobileId: props?.immobileId ?? 0,
                }),
            })
        }
        if (props.onSetPoints) {
            props.onSetPoints(value)
        }
    }
    const handleOnChange = (event) => {
        let files = [...event.target.files]
        if (files && files.length > 0) {
            setText(files[0].name)
            const reader = new FileReader()
            reader.readAsText(files[0])
            reader.onload = (event) => {
                var rawLog = reader.result
                let listResult = []
                const listFull = rawLog.toString().split("\n")
                listFull.map((element, index) => {
                    const list = element?.trim().split(",")
                    if (list[0]?.length > 0) {
                        listResult = [
                            ...listResult,
                            {
                                pointId: list[0],
                                epoch: list[1],
                                storedStatus: list[2],
                                ambiguityStatus: list[3],
                                gnssType: list[4],
                                type: list[5],
                                solutionType: list[6],
                                frequency: list[7],
                                eastingX: list[8],
                                northingY: list[9],
                                elipseHeightZ: list[10],
                                posnQuality: list[11],
                                heightQuality: list[12],
                                posnHeightQuality: list[13],
                            }
                        ]
                    }
                })
                handleOnSetPoints(listResult)
            }
        }
    }
    return (
        <div className="my-4 flex flex-row gap-2 items-center font-medium text-indigo-600 hover:text-indigo-500 ">
            <label
                htmlFor="file-upload"
                className="px-1 relative cursor-pointer rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 "
            >
                {text.length === 0 ?
                    <>
                        <span>Escolha um arquivo .CSV</span>
                        <input
                            type="file"
                            id="file-upload"
                            name="file-upload"
                            className="sr-only"
                            onChange={handleOnChange}
                        />
                    </>
                    :
                    <span onClick={() => setText("")}>{text}</span>
                }
            </label>
        </div>
    )
}

