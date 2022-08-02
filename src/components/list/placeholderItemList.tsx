interface PlaceholderItemListProps {
}

export default function PlaceholderItemList(props: PlaceholderItemListProps) {
    return (
        <>
            <button
                disabled={true}
                className="border border-gray-50 bg-white p-4 sm:p-8 rounded-sm shadow items-center text-left w-full">
                <div className="grid grid-cols-6">
                    <div className="animate-pulse p-2 col-span-4 bg-gray-300"></div>
                    <div className="mt-2 animate-pulse p-2 col-span-3 bg-gray-300"></div>
                    <div className="mt-2 animate-pulse p-2 col-span-6 bg-gray-300"></div>
                </div>
            </button>
        </>
    )
}
