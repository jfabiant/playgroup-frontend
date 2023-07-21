
interface IInput {
    type:string;
    placeholder:string;
    id:string;
    className?:string;
    name:string;
}

export default function Input(input: IInput){
    return(<input {...input} />)
}