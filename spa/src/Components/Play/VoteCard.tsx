import { FormControl, FormControlLabel, Radio, RadioGroup, Button, Typography, Card, CardContent } from "@material-ui/core";
import { useState, useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import PlayerAvatar from "../Shared/PlayerAvatar";

export function VoteCard() {
    const [target, setTarget] = useState("")    
    const {onVote, voteTargets} = useContext(RoomContext) as RoomContextType

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTarget((event.target as HTMLInputElement).value);
      };

    return <Card style={{position: "relative", left: "-10%", width: "120%"}}>
        <CardContent>
            <Typography variant="h5">
                Please vote
            </Typography>
        <form style={{marginTop: "1rem"}}>
            <FormControl component="fieldset">
            <RadioGroup row aria-label="vote" name="vote" value={target} onChange={handleChange} > 
                {                               
                    voteTargets.map((n, i) => (
                        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:5}}>
                            <div onClick={() => {setTarget(n)}}>
                                <PlayerAvatar nickname={n} size="large"/>
                            </div>
                            <FormControlLabel 
                                key={i} value={n} control={<Radio color="primary"/>}
                                label={<div>
                                            <Typography>
                                                {n}
                                            </Typography>
                                        </div>}/>
                        </div>)
                    )
                }
            </RadioGroup>
            </FormControl>
            <Button onClick={() => onVote(target)} color="primary" variant="contained" style={{marginTop: "1rem"}}>
                Vote
            </Button>
        </form>    
        </CardContent>
    </Card> 
}