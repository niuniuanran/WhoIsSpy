import { useParams } from "react-router-dom";
export default function Room(){
    const { code } = useParams<{code:string}>()
    return <div> {code} </div>
}