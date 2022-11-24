import FormRow from "./formRow";
import FormRowColumn from "./formRowColumn";

interface PlaceholderFormProps {
}

export default function PlaceholderForm(props: PlaceholderFormProps) {
    return (
        <>
            <FormRow>
                <FormRowColumn unit="6">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="3">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
                <FormRowColumn unit="3">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="3">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
                <FormRowColumn unit="3">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="6">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="2">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
            <FormRow>
                <FormRowColumn unit="4">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
                <FormRowColumn unit="2">
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="mt-2 animate-pulse p-2 bg-gray-300 dark:bg-gray-700"></div>
                </FormRowColumn>
            </FormRow>
        </>
    )
}
