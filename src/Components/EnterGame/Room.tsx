import { useParams } from "react-router-dom";
export default function Room(){
    const { roomId } = useParams<{roomId:string}>()
    return <div> {roomId} </div>
}