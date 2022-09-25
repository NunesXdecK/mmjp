import { useState } from "react";
import InputText from "../../components/inputText/inputText";
import InputSelectPersonCompany from "../../components/inputText/inputSelectPersonCompany";

export default function Users() {
    const [message, setMessage] = useState<string>("")

    return (
        <div className="p-4">
            <InputSelectPersonCompany
                title="Cliente"
                id="input-select"
            />

            <InputText
                id="test"
                title="test"
                value="Haha-ha"
            />
        </div>
    )
}
