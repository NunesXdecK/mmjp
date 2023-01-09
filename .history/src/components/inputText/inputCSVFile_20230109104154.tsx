import Button from "../button/button"

interface InputCVSFileProps {
    id?: string,
    text?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    onSet?: (arg0: string) => void,
    onSetPoints?: (arg0: any[]) => void,
}

export default function InputCVSFile(props: InputCVSFileProps) {

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
        }
    }
    const handleOnSetPoints = (value) => {
        if (props.onSetPoints) {
            props.onSetPoints(value)
        }
    }

    const handleOnChange = (event) => {
        let files = [...event.target.files]
        if (files && files.length > 0) {
            handleOnSet(files[0].name)
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
        <div>
            <label className="block text-sm font-medium text-gray-700">{props.text?.length > 0 ? "Arquivo escolhido" : "Escolha um arquivo .CSV"}</label>
            <div className="my-4 flex flex-row gap-2 items-center font-medium text-indigo-600 hover:text-indigo-500 ">
                {props?.text?.length > 0 ?
                    <>
                        <span>{props?.text}</span>
                        <Button
                            onClick={() => {
                                handleOnSet("")
                                handleOnSetPoints([])
                            }}
                            color="red"
                        >X</Button>
                    </>
                    :
                    <>
                        <label
                            htmlFor="file-upload"
                            className="px-1 relative cursor-pointer rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 "
                        >
                            <span>Selecione o arquivo</span>
                            <input
                                type="file"
                                id="file-upload"
                                name="file-upload"
                                className="sr-only"
                                onChange={handleOnChange}
                            />
                        </label>
                    </>
                }
            </div>
        </div>
    )
}

