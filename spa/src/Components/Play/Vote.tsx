import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button, Typography } from "@material-ui/core";
import { useState, useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import PlayerAvatar from "../Shared/PlayerAvatar";

export function Vote() {
    const [target, setTarget] = useState("")    
    const {onVote, voteTargets} = useContext(RoomContext) as RoomContextType

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTarget((event.target as HTMLInputElement).value);
      };

    return <form>
        <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row aria-label="vote" name="vote" value={target} onChange={handleChange}>
                {
                    voteTargets.map((n, i) => {
                        <FormControlLabel key={i} value={n} control={<Radio />} 
                            label={<div>
                                        <PlayerAvatar nickname={n} size="large"/>
                                        <Typography variant="caption">
                                            {n}
                                        </Typography>
                                    </div>}/>
                    })
                }
            </RadioGroup>
            </FormControl>
            <Button onClick={() => onVote(target)}>
                Vote
            </Button>
    </form>
}