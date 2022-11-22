import Button from "../button/button";

export interface NavBarPath {
    path?: string,
    onClick?: (any) => void,
}

interface NavBarProps {
    id?: string,
    className?: string,
    pathList?: NavBarPath[],
}

export default function NavBar(props: NavBarProps) {
    return (
        <div className={props.className}>
            {props.pathList?.map((element: NavBarPath, index) => (
                <Button
                    ignoreClass
                    onClick={element.onClick}
                    key={props.id + "-nav-bar-path"}
                    className="hover:text-blue-200"
                >
                    {element.path}
                </Button>
            ))}
        </div>
    )
}