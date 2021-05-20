
interface IButtonProps {
    canClick:boolean;
    loading:boolean;
    actionText:string;
}

export const Button: React.FC<IButtonProps> = ({canClick, loading, actionText}) => 
<button 
    role="button"
    className={`text-white text-lg font-medium focus:outline-none py-4 transition-colors 
    ${canClick 
        ? "bg-green-600 hover:bg-green-700" 
        : "bg-gray-300 pointer-events-none"
    }`}
    >{loading ? "Loading..." : actionText}
</button> 