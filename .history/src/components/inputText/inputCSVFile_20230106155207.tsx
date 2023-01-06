import Button from "../button/button"

interface InputCVSFileProps {
    id?: string,
    text?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    onSet?: (arg0: string) => void,
}

export default function InputCVSFile(props: InputCVSFileProps) {

    const handleOnSet = (value) => {
        if (props.onSet) {
            props.onSet(value)
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
                console.log(rawLog)
                let listResult = []
                const listFull = rawLog.toString().split("\n")
                listFull.map((element, index) => {
                    const list = element.split(",")
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
                                northY: list[9],
                                elipseHeightZ: list[10],
                                posnQuality: list[11],
                                heightQuality: list[12],
                                posnHeightQuality: list[13],
                            }
                        ]
                    }
                })
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
                    <Button color="red">X</Button>
                </>
                    :
                    <>
                        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
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
            {props?.text?.length === 0 &&
                <label className="block text-sm font-medium text-gray-700">ou</label>
            }
        </div>
    )
}

