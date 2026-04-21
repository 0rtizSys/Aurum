import { LRButton } from "./Button"

export const Login_register_layout = () => {
    return (
        <div className="flex gap-4 justify-center items-center">
            <LRButton text="Login" dotColor="gold" />
            <span className="text-slate-700 select-none font-light">|</span>
            <LRButton text="Register" dotColor="gold" />
        </div>
    )
}